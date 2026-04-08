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

  return {
    id: user.id,
    email: user.email ?? "",
    fullName:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User",
  };
}
