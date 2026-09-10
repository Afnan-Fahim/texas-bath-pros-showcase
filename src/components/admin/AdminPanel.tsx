import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabasePublic as supabase } from "@/integrations/supabase/public-client";
import { claimAdmin } from "@/lib/admin.functions";
import { resolveQuizImageUrl } from "@/lib/quiz-images";
import {
  DEFAULT_QUIZ_CONFIG,
  fetchQuizConfig,
  saveQuizConfig,
  type QuizConfig,
} from "@/lib/quiz-content";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  homeowner: string;
  timeframe: string;
  notes: string;
  source: string;
  booked: boolean;
  appointment_date: string;
  created_at: string;
};

const REQUEST_TIMEOUT_MS = 1900;

function withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(message)), REQUEST_TIMEOUT_MS);
    }),
  ]);
}

export function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [adminError, setAdminError] = useState("");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsError, setLeadsError] = useState("");
  const [quizConfig, setQuizConfig] = useState<QuizConfig>(DEFAULT_QUIZ_CONFIG);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string>("");
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let active = true;

    // Fallback to stop the spinner if auth is completely stuck
    const fallback = setTimeout(() => {
      if (active) setAuthReady(true);
    }, 5000);

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error("Auth session error:", error);
        setAuthMessage("Could not verify login session.");
      }
      setSession(data.session);
      setAuthReady(true);
      clearTimeout(fallback);
    }).catch(err => {
      console.error("Auth session fatal error:", err);
      if (active) setAuthReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      setAuthReady(true);
    });

    return () => {
      active = false;
      clearTimeout(fallback);
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadData = useCallback(async () => {
    setCheckingAdmin(true);
    setAdminError("");
    setLeadsError("");
    try {
      await withTimeout(
        (async () => {
          // Works on any domain: check the role directly with the signed-in
          // session, and only fall back to the server call to claim the very
          // first admin account.
          const { data: userData } = await supabase.auth.getUser();
          const uid = userData.user?.id;
          let admin = false;

          if (uid) {
            const { data: roleRow } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", uid)
              .eq("role", "admin")
              .maybeSingle();
            admin = !!roleRow;
          }

          if (!admin) {
            try {
              admin = (await claimAdmin()).isAdmin;
            } catch (err) {
              console.error("claimAdmin failed:", err);
            }
          }

          setIsAdmin(admin);
          if (!admin) return;

          const [leadResult, config] = await Promise.all([
            supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(500),
            fetchQuizConfig(),
          ]);

          if (leadResult.error) setLeadsError(leadResult.error.message);
          else setLeads((leadResult.data ?? []) as Lead[]);

          setQuizConfig(config);
          const previewEntries = await Promise.all(
            config.steps.flatMap((step) =>
              step.options
                .filter((opt) => !!opt.image)
                .map(async (opt) => [opt.image as string, await resolveQuizImageUrl(opt.image as string)] as const),
            ),
          );
          setPreviews(Object.fromEntries(previewEntries));
        })(),
        "Admin service did not respond within two seconds.",
      );
    } catch (err) {
      console.error("Admin data load failed:", err);
      setAdminError(err instanceof Error ? err.message : "Failed to load admin dashboard.");
    } finally {
      setCheckingAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      void loadData();
    } else {
      setIsAdmin(false);
      setCheckingAdmin(false);
    }
  }, [session, loadData]);

  const handleAuth = async (e: FormEvent, mode: "in" | "up") => {
    e.preventDefault();
    setAuthBusy(true);
    setAuthMessage("");
    try {
      const { error } = await (mode === "in"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          }));
      
      if (error) {
        setAuthMessage(error.message);
      } else if (mode === "up") {
        setAuthMessage("Account created. You can log in now.");
      }
    } catch (err) {
      setAuthMessage(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setAuthBusy(false);
    }
  };

  const updateStep = (stepIdx: number, patch: Partial<QuizConfig["steps"][number]>) => {
    setQuizConfig((cfg) => ({
      ...cfg,
      steps: cfg.steps.map((s, i) => (i === stepIdx ? { ...s, ...patch } : s)),
    }));
  };

  const updateOption = (stepIdx: number, optIdx: number, patch: { label?: string; image?: string }) => {
    setQuizConfig((cfg) => ({
      ...cfg,
      steps: cfg.steps.map((s, i) =>
        i === stepIdx
          ? { ...s, options: s.options.map((o, j) => (j === optIdx ? { ...o, ...patch } : o)) }
          : s,
      ),
    }));
  };

  const addOption = (stepIdx: number) => {
    setQuizConfig((cfg) => ({
      ...cfg,
      steps: cfg.steps.map((s, i) =>
        i === stepIdx
          ? { ...s, options: [...s.options, { id: `option-${Date.now()}`, label: "New choice", image: "" }] }
          : s,
      ),
    }));
  };

  const removeOption = (stepIdx: number, optIdx: number) => {
    setQuizConfig((cfg) => ({
      ...cfg,
      steps: cfg.steps.map((s, i) =>
        i === stepIdx ? { ...s, options: s.options.filter((_, j) => j !== optIdx) } : s,
      ),
    }));
  };

  const updateContact = (patch: Partial<QuizConfig["contact"]>) => {
    setQuizConfig((cfg) => ({ ...cfg, contact: { ...cfg.contact, ...patch } }));
  };

  const uploadOptionPhoto = async (stepIdx: number, optIdx: number, file: File) => {
    const key = `${stepIdx}-${optIdx}`;
    setUploading(key);
    setSaveMessage("");
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `quiz/${quizConfig.steps[stepIdx].id}-${optIdx}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("quiz-assets")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;

      const preview = await resolveQuizImageUrl(path);
      setPreviews((p) => ({ ...p, [path]: preview }));
      updateOption(stepIdx, optIdx, { image: path });
      setSaveMessage("Photo uploaded. Click “Save quiz” to publish it to /quiz.");
    } catch (err) {
      setSaveMessage(`Upload failed: ${(err as Error).message}`);
    } finally {
      setUploading("");
    }
  };

  const handleSaveQuiz = async () => {
    setSavingQuiz(true);
    setSaveMessage("");
    try {
      await saveQuizConfig(quizConfig);
      setSaveMessage("Saved. /quiz is updated.");
    } catch (err) {
      setSaveMessage(`Save failed: ${(err as Error).message}`);
    } finally {
      setSavingQuiz(false);
    }
  };

  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-card border rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <form className="space-y-4" onSubmit={(e) => handleAuth(e, "in")}>
          <div>
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {!authReady && (
            <p className="text-sm text-muted-foreground">Checking for a saved login…</p>
          )}
          {authMessage && (
            <p className={`text-sm ${authMessage.includes("created") ? "text-primary" : "text-destructive"}`}>
              {authMessage}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={authBusy}>
            {authBusy ? "Please wait…" : "Log In"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={authBusy}
            onClick={(e) => handleAuth(e, "up")}
          >
            Create admin account
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">{session.user.email}</span>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            Log Out
          </Button>
        </div>
      </div>

      {(checkingAdmin || adminError || !isAdmin) && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg flex justify-between items-center">
          <span>
            {checkingAdmin
              ? "Checking admin access…"
              : adminError || "This account does not have admin access."}
          </span>
          {!checkingAdmin && <Button variant="ghost" size="sm" onClick={() => void loadData()}>Retry</Button>}
        </div>
      )}

      {/* Quiz editor — every step */}
      <section className="p-6 bg-card border rounded-xl shadow-sm">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Quiz steps</h2>
            <p className="text-sm text-muted-foreground">
              Edit every question, description, answer label and photo. Save to publish to /quiz.
            </p>
          </div>
          <Button onClick={() => void handleSaveQuiz()} disabled={!isAdmin || savingQuiz}>
            {savingQuiz ? "Saving…" : "Save quiz"}
          </Button>
        </div>

        {saveMessage && (
          <p className={`text-sm mb-4 ${saveMessage.toLowerCase().includes("failed") ? "text-destructive" : "text-primary"}`}>
            {saveMessage}
          </p>
        )}

        <div className="space-y-8">
          {quizConfig.steps.map((step, stepIdx) => (
            <div key={step.id} className="border rounded-lg p-4 bg-background space-y-4">
              <h3 className="font-semibold text-lg">Step {stepIdx + 1}</h3>

              <div className="space-y-2">
                <Label className="text-xs">Question title</Label>
                <Input
                  value={step.title}
                  disabled={!isAdmin}
                  onChange={(e) => updateStep(stepIdx, { title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Short description</Label>
                <Textarea
                  value={step.description}
                  rows={2}
                  disabled={!isAdmin}
                  onChange={(e) => updateStep(stepIdx, { description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {step.options.map((opt, optIdx) => {
                  const key = `${stepIdx}-${optIdx}`;
                  const preview = opt.image ? previews[opt.image] || opt.image : "";
                  return (
                    <div key={opt.id} className="border rounded-lg p-3 space-y-3">
                      {preview ? (
                        <img src={preview} alt={opt.label} className="w-full h-32 object-cover rounded" />
                      ) : (
                        <div className="w-full h-32 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          No photo (shows as a text button)
                        </div>
                      )}
                      <div className="space-y-1">
                        <Label className="text-xs">Answer label</Label>
                        <Input
                          value={opt.label}
                          disabled={!isAdmin}
                          onChange={(e) => updateOption(stepIdx, optIdx, { label: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Upload photo</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          disabled={!isAdmin || uploading === key}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void uploadOptionPhoto(stepIdx, optIdx, file);
                          }}
                        />
                        {uploading === key && (
                          <p className="text-xs text-muted-foreground animate-pulse">Uploading…</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {opt.image && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={!isAdmin}
                            onClick={() => updateOption(stepIdx, optIdx, { image: "" })}
                          >
                            Remove photo
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          disabled={!isAdmin}
                          onClick={() => removeOption(stepIdx, optIdx)}
                        >
                          Delete choice
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button type="button" variant="outline" size="sm" disabled={!isAdmin} onClick={() => addOption(stepIdx)}>
                + Add choice
              </Button>
            </div>
          ))}

          {/* Contact step */}
          <div className="border rounded-lg p-4 bg-background space-y-4">
            <h3 className="font-semibold text-lg">Step {quizConfig.steps.length + 1} — contact form</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ["headline", "Headline"],
                ["subline", "Subline"],
                ["nameLabel", "Name field label"],
                ["emailLabel", "Email field label"],
                ["phoneLabel", "Phone field label"],
                ["addressLabel", "Address field label"],
                ["homeownerLabel", "Homeowner question label"],
                ["submitLabel", "Button text"],
                ["footnote", "Text under the button"],
              ] as const).map(([field, label]) => (
                <div key={field} className="space-y-1">
                  <Label className="text-xs">{label}</Label>
                  <Input
                    value={quizConfig.contact[field]}
                    disabled={!isAdmin}
                    onChange={(e) => updateContact({ [field]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leads */}
      <section className="p-6 bg-card border rounded-xl shadow-sm">
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="text-2xl font-bold">Leads</h2>
          <span className="text-sm text-muted-foreground">{leads.length} total</span>
        </div>
        
        {leadsError && <p className="text-sm text-destructive mb-4">{leadsError}</p>}
        
        {leads.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">No leads found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4 font-semibold">Received</th>
                  <th className="py-2 pr-4 font-semibold">Name</th>
                  <th className="py-2 pr-4 font-semibold">Contact</th>
                  <th className="py-2 pr-4 font-semibold">Address / ZIP</th>
                  <th className="py-2 pr-4 font-semibold">Status</th>
                  <th className="py-2 pr-4 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b align-top hover:bg-muted/50 transition-colors">
                    <td className="py-4 pr-4 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleString("en-US", {
                        timeZone: "America/Chicago",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="py-4 pr-4 font-medium">{lead.name}</td>
                    <td className="py-4 pr-4">
                      <div className="flex flex-col">
                        <a href={`tel:${lead.phone}`} className="hover:underline text-primary">
                          {lead.phone}
                        </a>
                        <span className="text-xs text-muted-foreground">{lead.email}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">{lead.address}</td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      {lead.booked ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Booked {lead.appointment_date}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </td>
                    <td className="py-4 pr-4 max-w-xs whitespace-pre-wrap text-muted-foreground text-xs leading-relaxed">
                      {[lead.timeframe, lead.homeowner, lead.notes, lead.source]
                        .filter(Boolean)
                        .join("\n")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
