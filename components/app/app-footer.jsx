"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShieldCheck } from "lucide-react";

const footerLinks = {
  Navigation: [
    { label: "Home", href: "/" },
    { label: "My Account", href: "/dashboard" },
    { label: "History", href: "/history" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Services", href: "#" },
  ],
};

export default function AppFooter() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin-secure");

  if (isAdminPage) return null;

  return (
    <footer className="w-full border-t border-white/8 bg-white backdrop-blur-xl mt-auto">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 w-fit group">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg">
                I O
              </div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Invoice Onlineinit
              </p>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Create professional invoices online instantly with our simple and
              reliable invoice generator.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
             Trusted by Over 10,000 Businesses Worldwide
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} Invoice Onlineinit. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            Made for{" "}
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for
            modern teams
          </p>
        </div>
      </div>
    </footer>
  );
}
