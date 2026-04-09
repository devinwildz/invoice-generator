"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { signupAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast-provider";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signupAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    if (state?.success) {
      setOpen(true);
      push("Verification email sent.", "success");
    } else if (state?.error) {
      push(state.error, "error");
    }
  }, [state, push]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" placeholder="Alex Johnson" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@company.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            className="pr-12"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {state?.error && (
        <p className="rounded-md border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button className="w-full" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-primary hover:underline" href="/login">
          Sign in
        </Link>
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check your email</DialogTitle>
            <DialogDescription>
              Verification link has been sent to your email. Please verify your
              account before logging in.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <Link href="/login">
              <Button className="w-full">Back to login</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
