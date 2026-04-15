import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BrandLogo, BrandName } from "@/components/app/branding";

export default async function ForgotPasswordPage() {
  const supabase = await createSupabaseServerClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  const siteTitle = settings?.site_title || "Invoice Online";
  const logoUrl = settings?.logo_url;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <BrandLogo logoUrl={logoUrl} siteTitle={siteTitle} />
          <BrandName siteTitle={siteTitle} />
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
