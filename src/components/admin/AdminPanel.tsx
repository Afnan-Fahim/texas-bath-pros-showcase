import React, { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { claimAdmin } from "@/lib/admin.functions";
import { QUIZ_IMAGE_SLOTS, resolveQuizImageUrl } from "@/lib/quiz-images";
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

type SlotState = { path: string; preview: string; busy: boolean };

export function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsError, setLeadsError] = useState("");
  const [slots, setSlots] = useState<Record<string, SlotState>>({});
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setChecking(false);
    });

    // Never leave the page sitting on a spinner if the session lookup is slow.
    const fallback = setTimeout(() => {
      if (active) setChecking(false);
    }, 1500);

    return () => {
      active = false;
      clearTimeout(fallback);
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadData = useCallback(async () => {
    const { isAdmin: admin } = await claimAdmin();
    setIsAdmin(admin);
    if (!admin) return;

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) setLeadsError(error.message);
    else setLeads((data ?? []) as Lead[]);

    const { data: imgs } = await supabase.from("quiz_images").select("slot, image_url");
    const next: Record<string, SlotState> = {};
    for (const s of QUIZ_IMAGE_SLOTS) {
      const row = imgs?.find((i) => i.slot === s.slot);
      const path = row?.image_url ?? "";
      next[s.slot] = { path, preview: await resolveQuizImageUrl(path), busy: false };
    }
    setSlots(next);
  }, []);

  useEffect(() => {
    if (session) void loadData();
  }, [session, loadData]);

  const handleAuth = async (e: React.FormEvent, mode: "in" | "up") => {
    e.preventDefault();
    setAuthBusy(true);
    setAuthMessage("");
    const fn =
      mode === "in"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    const { error } = await fn;
    if (error) setAuthMessage(error.message);
    else if (mode === "up") setAuthMessage("Account created. You can log in now.");
    setAuthBusy(false);
  };

  const uploadSlot = async (slot: string, file: File) => {
    setSaveMessage("");
    setSlots((s) => ({ ...s, [slot]: { ...s[slot]!, busy: true } }));
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `step1/${slot}-${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("quiz-assets")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;

      const { error: dbErr } = await supabase
        .from("quiz_images")
        .update({ image_url: path })
        .eq("slot", slot);
      if (dbErr) throw dbErr;

      const preview = await resolveQuizImageUrl(path);
      setSlots((s) => ({ ...s, [slot]: { path, preview, busy: false } }));
      setSaveMessage("Saved. The new photo is live on /quiz.");
    } catch (err) {
      setSlots((s) => ({ ...s, [slot]: { ...s[slot]!, busy: false } }));
      setSaveMessage(`Upload failed: ${(err as Error).message}`);
    }
  };

  if (checking) {
    return <div className="p-8 text-muted-foreground">Checking your login…</div>;
  }

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
          {authMessage && <p className="text-sm text-muted-foreground">{authMessage}</p>}
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

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-card border rounded-xl shadow-sm space-y-4">
        <h1 className="text-xl font-bold">This account is not an admin</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as {session.user.email}. Ask an existing admin to add you.
        </p>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>
          Log Out
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin</h1>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>
          Log Out
        </Button>
      </div>

      {/* Quiz step 1 photo editor */}
      <section className="p-6 bg-card border rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-1">Quiz photos (step 1)</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Upload a photo for each option. It appears on /quiz right away.
        </p>
        {saveMessage && <p className="text-sm mb-4">{saveMessage}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {QUIZ_IMAGE_SLOTS.map((s) => {
            const state = slots[s.slot];
            return (
              <div key={s.slot} className="border rounded-lg p-4 bg-background">
                <h3 className="font-semibold mb-3">{s.label}</h3>
                {state?.preview ? (
                  <img
                    src={state.preview}
                    alt={s.label}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                ) : (
                  <div className="w-full h-40 bg-muted rounded mb-4 flex items-center justify-center text-sm text-muted-foreground">
                    No photo uploaded yet
                  </div>
                )}
                <Label className="text-xs mb-1 block">Upload new photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  disabled={state?.busy}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadSlot(s.slot, file);
                  }}
                />
                {state?.busy && (
                  <p className="text-xs text-muted-foreground mt-2">Uploading…</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Leads */}
      <section className="p-6 bg-card border rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-1">Leads</h2>
        <p className="text-sm text-muted-foreground mb-6">{leads.length} total</p>
        {leadsError && <p className="text-sm text-destructive mb-4">{leadsError}</p>}
        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">No leads yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Received</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Address / ZIP</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Details</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b align-top">
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleString("en-US", {
                        timeZone: "America/Chicago",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="py-2 pr-4">{lead.name}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      <a href={`tel:${lead.phone}`} className="underline">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="py-2 pr-4">{lead.email}</td>
                    <td className="py-2 pr-4">{lead.address}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {lead.booked ? `Booked${lead.appointment_date ? ` — ${lead.appointment_date}` : ""}` : "New"}
                    </td>
                    <td className="py-2 pr-4 max-w-sm whitespace-pre-wrap text-muted-foreground">
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
