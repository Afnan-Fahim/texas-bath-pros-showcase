// Custom Supabase project client (project ref: dwjvzviopipgjrekhjqg).
// Used by the admin panel and quiz system, which live in the customer's own
// Supabase project rather than the Lovable Cloud backend.
// Reads VITE_CUSTOM_SUPABASE_URL / VITE_CUSTOM_SUPABASE_PUBLISHABLE_KEY.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env["VITE_CUSTOM_SUPABASE_URL"] as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env["VITE_CUSTOM_SUPABASE_PUBLISHABLE_KEY"] as
  | string
  | undefined;

function createCustomClient() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      "Missing custom Supabase environment variable(s): VITE_CUSTOM_SUPABASE_URL, VITE_CUSTOM_SUPABASE_PUBLISHABLE_KEY",
    );
  }
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _client: ReturnType<typeof createCustomClient> | undefined;

export const customSupabase = new Proxy({} as ReturnType<typeof createCustomClient>, {
  get(_, prop, receiver) {
    if (!_client) _client = createCustomClient();
    return Reflect.get(_client, prop, receiver);
  },
});
