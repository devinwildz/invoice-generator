"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  UserCircle,
  LogOut,
  Zap,
  Menu as MenuIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const BASE = "/admin-secure5094xjd";

const NAV_LINKS = [
  {
    href: BASE,
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: `${BASE}/users`,
    label: "Users",
    icon: Users,
  },
  {
    href: `${BASE}/settings`,
    label: "Site Settings",
    icon: Settings,
  },
  {
    href: `${BASE}/menus`,
    label: "Menus",
    icon: MenuIcon,
  },
  {
    href: `${BASE}/account`,
    label: "My Account",
    icon: UserCircle,
  },
];

export default function AdminSidebar({ collapsed, onToggle, user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href, exact) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      aria-label="Admin navigation"
      className={cn(
        "admin-sidebar relative flex h-full flex-col overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out",
        " dark:bg-slate-900/20 border-r border-border/40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 border-b border-border/40 p-3.5",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/20">
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Invoice Studio
            </p>
            <p className="truncate text-sm font-bold text-foreground">
              Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4" aria-label="Sidebar navigation">
        <ul role="list" className="space-y-1.5">
          {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? label : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    collapsed && "justify-center px-2",
                    active
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/20 dark:shadow-none"
                      : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800/60 dark:hover:text-foreground"
                  )}
                >
                  <Icon
                    size={18}
                    className={cn(
                      "shrink-0 transition-transform duration-150",
                      !active && "group-hover:scale-110"
                    )}
                  />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info + logout */}
      <div className="border-t border-border/40 p-3">
        {!collapsed && (
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/40 px-3 py-2.5 border border-border/10">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white uppercase">
              {user?.fullName?.charAt(0) ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-foreground">
                {user?.fullName ?? "Admin"}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {user?.email ?? ""}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          title={collapsed ? "Sign out" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
