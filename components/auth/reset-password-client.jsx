"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { BrandLogo, BrandName } from "@/components/app/branding";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const { data: settings } = useSiteSettings();
  const [message, setMessage] = useState("Validating reset link...");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const errorDescription = searchParams.get("error_description");
    const hasToken =
      code ||
      searchParams.get("access_token") ||
      searchParams.get("token_hash");

    if (!hasToken && !errorDescription) {
      setStatus("error");
      setMessage("Reset link is missing or invalid.");
      return;
    }
    if (errorDescription) {
      setStatus("error");
      setMessage(decodeURIComponent(errorDescription));
      return;
    }

    const supabase = createSupabaseBrowserClient();

    const finalize = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setStatus("ready");
        setMessage("Set a new password for your account.");
      } else {
        setStatus("error");
        setMessage("Reset link is invalid or expired.");
      }
    };

    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(() => finalize())
        .catch(() => {
          setStatus("error");
          setMessage("Reset link is invalid or expired.");
        });
      return;
    }

    finalize();
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await supabase.auth.signOut();
    router.replace("/login?reset=success");
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <BrandLogo logoUrl={settings?.logo_url} siteTitle={settings?.site_title || "Invoice Online"} />
          <BrandName siteTitle={settings?.site_title || "Invoice Online"} />
        </div>
        <h1 className="text-4xl font-semibold text-slate-900">
          Reset your password.
        </h1>
        <p className="text-base text-slate-600">{message}</p>
        {status === "error" && (
          <Link
            className="text-sm font-medium text-primary hover:underline"
            href="/login"
          >
            Back to login
          </Link>
        )}
      </div>
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>
            {status === "ready" ? "Choose a new password" : "Reset status"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "ready" ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2 ">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                />
              </div>
              {error && (
                <p className="rounded-md border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button className="w-full" disabled={saving}>
                {saving ? "Updating..." : "Update password"}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
