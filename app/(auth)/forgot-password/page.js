import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg">
            I O
          </div>
          <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Invoice Onlineinit
          </span>
        </div>
        <h1 className="text-4xl font-semibold text-slate-900">
          Forgot your password?
        </h1>
        <p className="text-base text-slate-600">
          Enter your email and we’ll send a secure link to reset your password.
        </p>
        <Link
          className="text-sm font-medium text-primary hover:underline"
          href="/login"
        >
          Back to login
        </Link>
      </div>
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
