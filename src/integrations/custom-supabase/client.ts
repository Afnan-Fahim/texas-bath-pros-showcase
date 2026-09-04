// Custom Supabase project client (project ref: dwjvzviopipgjrekhjqg).
// Used by the admin panel and quiz system, which live in the customer's own
// Supabase project rather than the Lovable Cloud backend.
// The publishable (anon) key is safe to ship in browser code; access is
// controlled by Row Level Security on the custom project.
import { createClient } from "@supabase/supabase-js";

const FALLBACK_URL = "https://dwjvzviopipgjrekhjqg.supabase.co";
const FALLBACK_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3anZ6dmlvcGlwZ2pyZWtoanFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNzgwMjQsImV4cCI6MjEwMzY1NDAyNH0.HYFT-v_wl6j-b3Pow6Y0F8PVnKAhdef3Rh_p6C0OdIQ";

function createCustomClient() {
  const url = (import.meta.env["VITE_CUSTOM_SUPABASE_URL"] as string | undefined) || FALLBACK_URL;
  const key =
    (import.meta.env["VITE_CUSTOM_SUPABASE_PUBLISHABLE_KEY"] as string | undefined) ||
    FALLBACK_PUBLISHABLE_KEY;
  return createClient(url, key, {
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
