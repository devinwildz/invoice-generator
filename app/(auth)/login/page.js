import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/auth";
import LoginForm from "@/components/auth/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage() {
  const user = await getOptionalUser();
  if (user) redirect("/dashboard");

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg">
            IO
          </div>
          <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Invoice Onlineinit
          </span>
        </div>
        <h1 className="text-4xl font-semibold text-slate-900">Welcome back.</h1>
        <p className="text-base text-slate-600">
          Keep your invoicing workflow in one place. Track draft, sent, and paid
          invoices in minutes.
        </p>
      </div>
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
