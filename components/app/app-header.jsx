"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Home, User, History, LogOut, Laptop } from "lucide-react";
import { useMenus } from "@/hooks/useNavigation";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function AppHeader({ user }) {
  const router = useRouter();
  const { data: menus } = useMenus();
  const { data: settings } = useSiteSettings();
  const [open, setOpen] = useState(false);

  // Filter header links
  const headerLinks = (menus || []).filter(m => m.position === "header");

  const siteTitle = settings?.site_title || "Invoice Online";
  const logoUrl = settings?.logo_url;

  const firstName = user?.fullName?.split(" ")[0] || "User";
  const initial = firstName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // ✅ outside click close
  useEffect(() => {
    const handleClickOutside = () => setOpen(false);
    if (open) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <header className="relative z-50 border-b border-border bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={siteTitle} className="h-full w-full object-cover" />
            ) : (
              "I O"
            )}
          </div>
          <Link href="/">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
              {siteTitle}
            </p>
            <p className="text-lg font-semibold text-foreground">Dashboard</p>
          </Link>
        </div>

        {/* CENTER - Dynamic Links */}
        <nav className="hidden md:flex items-center gap-8">
          {headerLinks.map((link) => (
            <Link 
              key={link.id} 
              href={link.href}
              className="text-sm font-medium capitalize text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT */}
        <div className="relative flex items-center gap-3">
          
          {/* ✅ Desktop only */}
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-foreground">
              Hello, 👋 {firstName}
            </p>
          </div>

          {/* Avatar */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-white font-semibold"
          >
            {initial}
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-12 z-[999] w-52 rounded-xl border bg-white shadow-lg">
              
              {/* ✅ Mobile user info */}
              <div className="sm:hidden px-4 py-3 border-b">
                <p className="text-sm font-medium">Hello, {firstName}</p>
                <p className="text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>

              <Link href="/">
                <div className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                  <Home size={16} />
                  Home
                </div>
              </Link>

              <Link href="/my-account">
                <div className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                  <User size={16} />
                  My Account
                </div>
              </Link>

              <Link href="/dashboard">
                <div className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                  <History size={16} />
                  History
                </div>
              </Link>

              <button
                onClick={handleSignOut}
                className="flex w-full cursor-pointer items-center gap-2 text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}