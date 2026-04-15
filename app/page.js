import Link from "next/link";
import { getOptionalUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import AppFooter from "@/components/app/app-footer";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BrandLogo, BrandName } from "@/components/app/branding";

export default async function HomePage() {
  const user = await getOptionalUser();
  const supabase = await createSupabaseServerClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  const siteTitle = settings?.site_title || "Invoice Online";
  const logoUrl = settings?.logo_url;

  return (
    <>
      <div className="bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] min-h-screen from-blue-50 via-amber-50 to-slate-100">
        <header className="flex px-6 py-6 w-full max-w-6xl mx-auto items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo logoUrl={logoUrl} siteTitle={siteTitle} />
            <BrandName siteTitle={siteTitle} />
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm">Go to dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-col justify-between px-6 py-6">
          <main className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <h1 className=" text-4xl md:text-5xl font-semibold leading-tight text-slate-900">
                Build polished invoices that get you paid faster.
              </h1>
              <p className="text-lg text-slate-600">
                A modern invoicing workspace with live preview, client
                management, and instant PDF export. Everything you need to bill
                confidently.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={user ? "/dashboard" : "/signup"}>
                  <Button size="lg">Create your first invoice</Button>
                </Link>
                <Link href={user ? "/dashboard" : "/login"}>
                  <Button variant="outline" size="lg">
                    View demo
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap md:w-2/3 lg:w-full mt-5 justify-between gap-3 md:gap-6 text-sm text-slate-500">
                <div>
                  <p className="text-2xl font-semibold text-slate-900">+120%</p>
                  <p>Faster invoicing</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900">24/7</p>
                  <p>Access anywhere</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900">PDF</p>
                  <p>Export ready</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-3xl p-6 md:p-8 backdrop-blur">
              <div className="surface rounded-2xl p-4 md:p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] mb-1 text-slate-400">
                      Preview
                    </p>
                    <h2 className="text-lg md:text-2xl font-semibold text-slate-900">
                      INV-2026-4231
                    </h2>
                  </div>
                  <div className="rounded-xl bg-amber-50 px-4 py-2 text-right">
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-500">
                      Total
                    </p>
                    <p className="text-xl font-semibold text-amber-700">
                      $3,240
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 text-sm text-slate-600">
                  <p>Brand strategy</p>
                  <p>UX + UI design sprint</p>
                  <p>Frontend implementation</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <span>Due in 14 days</span>
                  <span>Sent to : Onlineinit</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <AppFooter />
    </>
  );
}
