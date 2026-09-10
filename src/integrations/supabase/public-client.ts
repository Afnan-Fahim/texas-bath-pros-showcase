// Browser Supabase client with built-in fallbacks so the same account works on
// every host (Lovable preview, texasbathsolutions.com, and the Vercel domain),
// even when that host's build environment does not inject VITE_SUPABASE_* vars.
// The publishable key is safe in browser code; access is controlled by RLS.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const FALLBACK_URL = "https://xbfbqbytfzwjqpovuiff.supabase.co";
const FALLBACK_KEY = "sb_publishable_NafpHAALfNplcbWHms2lUw_JghKe3w7";

function createBrowserClient() {
  const url = (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) || FALLBACK_URL;
  const key =
    (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined) || FALLBACK_KEY;

  return createClient<Database>(url, key, {
    global: {
      fetch: (input, init) => {
        const headers = new Headers(
          typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
        );
        if (init?.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));
        if (headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
    auth: {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storageKey: "sb-tbs-admin-auth",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

let _client: ReturnType<typeof createBrowserClient> | undefined;

export const supabasePublic = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_, prop, receiver) {
    if (!_client) _client = createBrowserClient();
    return Reflect.get(_client, prop, receiver);
  },
});
