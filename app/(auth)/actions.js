"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { loginSchema, signupSchema } from "@/lib/validations";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function loginAction(prevState, formData) {
  const payload = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    const message = error.message || "Login failed.";
    if (message.toLowerCase().includes("email not confirmed")) {
      return { error: "Your email is not verified.", code: "email_not_confirmed" };
    }
    return { error: message };
  }

  const user = data?.user;
  const isVerified = Boolean(user?.email_confirmed_at || user?.confirmed_at);

  if (!isVerified) {
    await supabase.auth.signOut();
    return { error: "Please verify your email before logging in." };
  }

  redirect("/dashboard");
}

export async function signupAction(prevState, formData) {
  const payload = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signupSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input." };
  }

  const supabase = await createSupabaseServerClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      ...(origin ? { emailRedirectTo: `${origin}/verify` } : {}),
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Proactively create profile in public.users
  if (data?.user) {
    try {
      const { error: insertError } = await supabase.from("users").upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: parsed.data.fullName,
        role: "customer",
        created_at: new Date().toISOString(),
      });
      
      if (insertError) {
        console.error("Profile sync failed in signupAction:", insertError.message);
      }
    } catch (e) {
      console.error("Unexpected error syncing profile after signup:", e);
    }
  }

  if (data?.session) {
    await supabase.auth.signOut();
  }
  return {
    success:
      "Verification link has been sent to your email. Please verify your account before logging in.",
  };
}

export async function requestPasswordResetAction(prevState, formData) {
  const email = formData.get("email");

  const parsed = loginSchema.pick({ email: true }).safeParse({ email });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid email." };
  }

  const supabase = await createSupabaseServerClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    origin ? { redirectTo: `${origin}/reset-password` } : undefined
  );

  if (error) {
    return { error: error.message };
  }

  return { success: "Password reset email sent. Check your inbox." };
}

export async function resendVerificationAction(prevState, formData) {
  const email = formData.get("email");
  const parsed = loginSchema.pick({ email: true }).safeParse({ email });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid email." };
  }

  const supabase = await createSupabaseServerClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    ...(origin ? { emailRedirectTo: `${origin}/verify` } : {}),
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Verification email resent. Check your inbox." };
}
