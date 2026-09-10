import { useEffect, useState } from "react";
import { supabasePublic as supabase } from "@/integrations/supabase/public-client";

export const QUIZ_IMAGE_SLOTS = [
  { slot: "walk-in-shower", label: "Walk-in shower" },
  { slot: "new-tub", label: "New tub remodel" },
] as const;

export type QuizImageMap = Record<string, string>;

/** Turns a stored storage path into a URL the browser can display. */
export async function resolveQuizImageUrl(path: string): Promise<string> {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  const { data } = await supabase.storage
    .from("quiz-assets")
    .createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? "";
}

export async function fetchQuizImages(): Promise<QuizImageMap> {
  const { data, error } = await supabase
    .from("quiz_images")
    .select("slot, image_url");

  if (error || !data) return {};

  const entries = await Promise.all(
    data.map(async (row) => [row.slot, await resolveQuizImageUrl(row.image_url)] as const)
  );

  return Object.fromEntries(entries.filter(([, url]) => !!url));
}

/** Live step 1 photos, uploaded from /admin. */
export function useQuizImages() {
  const [images, setImages] = useState<QuizImageMap>({});

  useEffect(() => {
    let active = true;
    fetchQuizImages().then((map) => {
      if (active) setImages(map);
    });
    return () => {
      active = false;
    };
  }, []);

  return images;
}
