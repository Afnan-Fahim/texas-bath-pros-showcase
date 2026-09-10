import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Returns whether the signed-in user is an admin.
 * Bootstrap: if no admin exists yet in the project, the first signed-in
 * account claims the admin role. After that, admins are granted manually.
 */
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (existing && existing.length > 0) {
      return { isAdmin: existing.some((r) => r.user_id === context.userId) };
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });

    if (error) {
      console.error("[admin] failed to grant first admin role", error);
      return { isAdmin: false };
    }

    return { isAdmin: true };
  });
