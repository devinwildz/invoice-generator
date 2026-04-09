"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const errorDescription = searchParams.get("error_description");
    const code = searchParams.get("code");
    const hasToken =
      code || searchParams.get("access_token") || searchParams.get("token_hash");

    if (!hasToken && !errorDescription) {
      setStatus("error");
      setMessage("Verification link is missing or invalid.");
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
      const user = data?.session?.user;
      const isVerified = Boolean(
        user?.email_confirmed_at || user?.confirmed_at
      );

      if (isVerified) {
        setStatus("success");
        setMessage("Email verified successfully. Redirecting to login...");
        supabase.auth.signOut().finally(() => {
          setTimeout(() => router.replace("/login?verified=1"), 1000);
        });
        return;
      }

      setStatus("error");
      setMessage(
        "Verification link is invalid or expired. Please log in to resend the verification email."
      );
    };

    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(() => finalize())
        .catch(() => {
          setStatus("error");
          setMessage("Verification link is invalid or expired.");
        });
      return;
    }

    finalize();
  }, [router, searchParams]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-blue-600">
          Invoice Studio
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">
          Verify your email.
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
            {status === "loading"
              ? "Checking verification"
              : status === "success"
              ? "Verified"
              : "Verification failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {status === "loading" && (
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
            )}
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          {status === "error" && (
            <Link href="/login">
              <Button className="w-full">Go to login</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
