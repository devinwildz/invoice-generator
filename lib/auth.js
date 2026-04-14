import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "./supabase/server";

export async function getOptionalUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data?.user ?? null;
  } catch (err) {
    // Fallback for local/dev setups missing Supabase envs.
    return null;
  }
}

export async function requireUser() {
  const user = await getOptionalUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    fullName:
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User",
    role: profile?.role || "customer",
  };
}

/**
 * Requires the current session user to have admin role.
 * - Checks user_metadata.role === 'admin'  (set from Admin UI role assignment)
 * - Falls back to comparing email with NEXT_PUBLIC_ADMIN_EMAIL env var
 * Redirects to /dashboard if not authorized.
 */
export async function requireAdmin() {
  const user = await getOptionalUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
  const isAdmin =
    profile?.role === "admin" ||
    (ADMIN_EMAIL !== "" && user.email === ADMIN_EMAIL);

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return {
    id: user.id,
    email: user.email ?? "",
    fullName:
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Admin",
    role: "admin",
  };
}
