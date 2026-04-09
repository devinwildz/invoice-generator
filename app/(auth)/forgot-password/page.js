import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-blue-600">
          Invoice Studio
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">
          Forgot your password?
        </h1>
        <p className="text-base text-slate-600">
          Enter your email and we’ll send a secure link to reset your password.
        </p>
        <Link className="text-sm font-medium text-primary hover:underline" href="/login">
          Back to login
        </Link>
      </div>
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
