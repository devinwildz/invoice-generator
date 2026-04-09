"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { loginAction, resendVerificationAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm({ verified, resetSuccess }) {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [resendState, resendAction, resendPending] = useActionState(
    resendVerificationAction,
    null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            className="mt-1.5"
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="pr-12 mt-1.5"
              placeholder="Enter your password"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 cursor-pointer flex items-center px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="text-right">
        <Link
          className="text-xs font-medium text-primary hover:underline"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
      </div>
        {state?.error && (
          <p className="rounded-md border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}
        <Button className="w-full" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {state?.code === "email_not_confirmed" && (
        <div className="space-y-2 rounded-lg border border-border bg-white/70 p-3 text-center text-xs text-muted-foreground">
          <p>Your email is not verified. Resend verification email?</p>
          <form action={resendAction}>
            <input type="hidden" name="email" value={email} />
            <button
              type="submit"
              disabled={resendPending || !email || cooldown > 0}
              onClick={() => setCooldown(10)}
              className="text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground"
            >
              {cooldown > 0
                ? `Resend in ${cooldown}s`
                : resendPending
                ? "Sending..."
                : "Resend Verification Email"}
            </button>
          </form>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link className="font-medium text-primary hover:underline" href="/signup">
          Create an account
        </Link>
      </p>
    </div>
  );
}
