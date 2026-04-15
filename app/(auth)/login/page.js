import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/auth";
import LoginForm from "@/components/auth/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BrandLogo, BrandName } from "@/components/app/branding";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const verified = params?.verified === "1" || params?.verified === "true";
  const reset = params?.reset === "success";
  const user = await getOptionalUser();
  if (user) redirect("/dashboard");

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
          <LoginForm verified={verified} resetSuccess={reset} />
        </CardContent>
      </Card>
    </div>
  );
}
