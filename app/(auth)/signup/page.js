import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/auth";
import SignupForm from "@/components/auth/signup-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SignupPage() {
  const user = await getOptionalUser();
  if (user) redirect("/dashboard");

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
          Start invoicing smarter.
        </h1>
        <p className="text-base text-slate-600">
          Create professional invoices, track payments, and export PDFs in a few
          clicks.
        </p>
      </div>
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}
