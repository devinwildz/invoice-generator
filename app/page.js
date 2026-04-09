import Link from "next/link";
import { getOptionalUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const user = await getOptionalUser();

  return (
    <>
      <div className="bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] min-h-screen from-blue-50 via-amber-50 to-slate-100">
        <header className="flex px-6 py-6 w-full max-w-6xl mx-auto items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg">
              I O
            </div>
            <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Invoice Onlineinit
            </span>
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

          {/* <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.7)] py-6 text-sm text-slate-500">
          <span>Built with Next.js + Supabase</span>
          <span>Invoice Studio, 2026</span>
        </footer> */}
        </div>
      </div>
    </>
  );
}
