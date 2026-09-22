import { fetchQuizConfig, type QuizConfig } from "@/lib/quiz-content";
import { resolveQuizImageUrl } from "@/lib/quiz-images";

/**
 * Resolves the quiz content with step 1's photo URLs already signed, so the
 * server-rendered HTML can ship the real image URLs (and <link rel=preload>)
 * on the very first byte. Ad clicks (…?fbclid=…) then start downloading the
 * photos with the document instead of after two extra round trips.
 */
let cached: { at: number; value: QuizConfig } | null = null;
const TTL = 1000 * 60 * 5; // signed URLs last 7 days; re-resolve every 5 min

export async function loadQuizConfigWithStepOne(): Promise<QuizConfig> {
  if (cached && Date.now() - cached.at < TTL) return cached.value;

  const raw = await fetchQuizConfig();
  const first = raw.steps[0];
  const value: QuizConfig = first
    ? {
        ...raw,
        steps: raw.steps.map((step, i) =>
          i === 0
            ? step
            : { ...step, options: step.options.map((o) => ({ ...o, image: "", imagePending: !!o.image })) },
        ),
      }
    : raw;

  if (first) {
    const options = await Promise.all(
      first.options.map(async (opt) => ({
        ...opt,
        image: opt.image ? await resolveQuizImageUrl(opt.image) : "",
      })),
    );
    value.steps = value.steps.map((s, i) => (i === 0 ? { ...s, options } : s));
  }

  cached = { at: Date.now(), value };
  return value;
}
