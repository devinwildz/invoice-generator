import Link from "next/link";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-blue-600">
          Invoice Studio
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">
          Reset your password.
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
          <CardTitle>Forgot password</CardTitle>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
