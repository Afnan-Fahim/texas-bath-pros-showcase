import { useEffect, useState } from "react";
import { supabasePublic as supabase } from "@/integrations/supabase/public-client";
import { resolveQuizImageUrl } from "@/lib/quiz-images";

export type QuizAnswerKey = "desiredUpgrade" | "mainProblem" | "timeline";

export type QuizOptionConfig = {
  id: string;
  label: string;
  /** Storage path, absolute URL, or public /images path. Empty = text button. */
  image?: string;
  /** True while the saved photo is still loading: render a blank card, not an old photo. */
  imagePending?: boolean;
};

export type QuizStepConfig = {
  id: string;
  key: QuizAnswerKey;
  title: string;
  description: string;
  options: QuizOptionConfig[];
};

export type QuizContactConfig = {
  headline: string;
  subline: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  addressLabel: string;
  homeownerLabel: string;
  submitLabel: string;
  footnote: string;
};

export type QuizConfig = {
  steps: QuizStepConfig[];
  contact: QuizContactConfig;
  /** Booking link shown after the last photo question. Editable in /admin. */
  calendlyUrl: string;
};

export const DEFAULT_CALENDLY_URL = "https://calendly.com/rugsafari/texas-bath-solutions";

export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  steps: [
    {
      id: "step-1",
      key: "desiredUpgrade",
      title: "Tap the one that looks like your project.",
      description:
        "15 seconds. We’ll come look at it and give you a straight price — no pressure.",
      options: [
        { id: "walk-in-shower", label: "Walk-in shower", image: "/images/quiz/walk-in-shower.jpg" },
        { id: "new-tub", label: "New tub remodel", image: "/images/quiz/new-tub.jpg" },
        { id: "not-sure", label: "Not sure yet" },
      ],
    },
    {
      id: "step-2",
      key: "mainProblem",
      title: "What's the main problem?",
      description: "Choose what matters most to you.",
      options: [
        { id: "hard-step", label: "Hard to step over", image: "/images/quiz/hard-step.jpg" },
        { id: "looks-dated", label: "Looks dated", image: "/images/quiz/looks-dated.jpg" },
        { id: "leak", label: "Leak or damage", image: "/images/quiz/leak.jpg" },
        { id: "not-guest-ready", label: "Not guest-ready", image: "/images/quiz/not-guest-ready.jpg" },
      ],
    },
    {
      id: "step-3",
      key: "timeline",
      title: "When would you like it done?",
      description: "Choose the timing that works best for you.",
      options: [
        { id: "asap", label: "ASAP" },
        { id: "2-weeks", label: "2 weeks" },
        { id: "1-3-months", label: "1–3 months" },
        { id: "just-looking", label: "Just looking" },
      ],
    },
  ],
  contact: {
    headline: "Where should we come look?",
    subline: "Free estimate at your house from a local Texas company. No pressure.",
    nameLabel: "Name *",
    emailLabel: "Email *",
    phoneLabel: "Mobile phone *",
    addressLabel: "Address *",
    homeownerLabel: "Are you the homeowner? *",
    submitLabel: "See available times",
    footnote: "Next you’ll pick a time. No charge, no obligation.",
  },
  calendlyUrl: "https://calendly.com/rugsafari/texas-bath-solutions",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/** Accepts any stored shape and fills gaps with the defaults. */
export function normalizeQuizConfig(raw: unknown): QuizConfig {
  if (!isRecord(raw)) return DEFAULT_QUIZ_CONFIG;

  const rawSteps = Array.isArray(raw.steps) ? raw.steps : null;
  const steps: QuizStepConfig[] = rawSteps
    ? rawSteps.filter(isRecord).map((step, i) => {
        const fallback = DEFAULT_QUIZ_CONFIG.steps[i] ?? DEFAULT_QUIZ_CONFIG.steps[0];
        const options = Array.isArray(step.options)
          ? step.options.filter(isRecord).map((opt, j) => ({
              id: String(opt.id ?? `option-${j + 1}`),
              label: String(opt.label ?? ""),
              image: typeof opt.image === "string" ? opt.image : "",
            }))
          : fallback.options;
        return {
          id: String(step.id ?? `step-${i + 1}`),
          key: (["desiredUpgrade", "mainProblem", "timeline"] as const).includes(step.key as QuizAnswerKey)
            ? (step.key as QuizAnswerKey)
            : fallback.key,
          title: String(step.title ?? fallback.title),
          description: String(step.description ?? fallback.description),
          options,
        };
      })
    : DEFAULT_QUIZ_CONFIG.steps;

  const contact = isRecord(raw.contact)
    ? { ...DEFAULT_QUIZ_CONFIG.contact, ...(raw.contact as Partial<QuizContactConfig>) }
    : DEFAULT_QUIZ_CONFIG.contact;

  const calendlyUrl =
    typeof raw.calendlyUrl === "string" && raw.calendlyUrl.trim()
      ? raw.calendlyUrl.trim()
      : DEFAULT_CALENDLY_URL;

  return { steps: steps.length ? steps : DEFAULT_QUIZ_CONFIG.steps, contact, calendlyUrl };
}

export async function fetchQuizConfig(): Promise<QuizConfig> {
  const { data, error } = await supabase
    .from("quiz_content")
    .select("config")
    .eq("id", "default")
    .maybeSingle();

  const saved = data?.config as Record<string, unknown> | undefined;
  if (error || !saved || !Array.isArray(saved.steps) || saved.steps.length === 0) {
    // No saved content yet: keep any photos uploaded with the old step 1 editor.
    const { data: legacyRows } = await supabase.from("quiz_images").select("slot, image_url");
    const legacy: Record<string, string> = Object.fromEntries(
      (legacyRows ?? []).filter((r) => !!r.image_url).map((r) => [r.slot, r.image_url]),
    );
    if (!Object.keys(legacy).length) return DEFAULT_QUIZ_CONFIG;
    return {
      ...DEFAULT_QUIZ_CONFIG,
      steps: DEFAULT_QUIZ_CONFIG.steps.map((step, i) =>
        i === 0
          ? { ...step, options: step.options.map((o) => ({ ...o, image: legacy[o.id] || o.image })) }
          : step,
      ),
    };
  }
  return normalizeQuizConfig(saved);
}

export async function saveQuizConfig(config: QuizConfig) {
  const { error } = await supabase
    .from("quiz_content")
    .upsert({ id: "default", config: JSON.parse(JSON.stringify(config)) });
  if (error) throw error;
}

/** Resolves every option image to a displayable URL. */
export async function resolveConfigImages(config: QuizConfig): Promise<QuizConfig> {
  const steps = await Promise.all(
    config.steps.map(async (step) => ({
      ...step,
      options: await Promise.all(
        step.options.map(async (opt) => ({
          ...opt,
          image: opt.image ? await resolveQuizImageUrl(opt.image) : "",
        })),
      ),
    })),
  );
  return { ...config, steps };
}

/** Same layout as the defaults, but with no photo shown yet. */
function blankImages(config: QuizConfig): QuizConfig {
  return {
    ...config,
    steps: config.steps.map((step) => ({
      ...step,
      options: step.options.map((opt) => ({
        ...opt,
        image: "",
        imagePending: !!opt.image,
      })),
    })),
  };
}

/** Decodes the given photos so cards paint with the final image in one go. */
async function preloadImages(urls: string[]): Promise<void> {
  if (typeof window === "undefined") return;
  await Promise.all(
    urls.filter(Boolean).map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        }),
    ),
  );
}

async function resolveStepImages(step: QuizStepConfig): Promise<QuizStepConfig> {
  return {
    ...step,
    options: await Promise.all(
      step.options.map(async (opt) => ({
        ...opt,
        image: opt.image ? await resolveQuizImageUrl(opt.image) : "",
      })),
    ),
  };
}

/**
 * Renders the quiz layout instantly with blank photo cards, paints step 1 as
 * soon as its own two photos are decoded, then fills the later steps in the
 * background. Never shows old/default photos.
 */
export function useQuizConfig(): { config: QuizConfig; ready: boolean } {
  const [{ config, ready }, setState] = useState<{ config: QuizConfig; ready: boolean }>(() => ({
    config: blankImages(DEFAULT_QUIZ_CONFIG),
    ready: false,
  }));
  const setConfig = (next: QuizConfig) => setState({ config: next, ready: true });

  useEffect(() => {
    let active = true;
    (async () => {
      const raw = await fetchQuizConfig();
      const blank = blankImages(raw);
      const firstStep = raw.steps[0];
      if (!firstStep) return;
      const first = await resolveStepImages(firstStep);
      if (!active) return;
      await preloadImages(first.options.map((o) => o.image ?? ""));
      if (!active) return;
      // First screen is ready — show it before touching later steps.
      setConfig({ ...blank, steps: blank.steps.map((s, i) => (i === 0 ? first : s)) });

      const restSteps = await Promise.all(raw.steps.slice(1).map(resolveStepImages));
      if (!active) return;
      await preloadImages(restSteps.flatMap((s) => s.options.map((o) => o.image ?? "")));
      if (!active) return;
      setConfig({ ...raw, steps: [first, ...restSteps] });
    })().catch(() => {
      /* keep blank cards */
    });
    return () => {
      active = false;
    };
  }, []);

  return config;
}
