"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          className="mt-1.5"
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
        />
      </div>
      {state?.error && (
        <p className="rounded-md border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-md border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] px-3 py-2 text-sm text-emerald-700">
          {state.success}
        </p>
      )}
      <Button className="w-full" disabled={pending}>
        {pending ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
