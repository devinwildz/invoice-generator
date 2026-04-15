"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, Sun, Moon, X } from "lucide-react";
import { useTheme } from "@/components/admin/theme-provider";
import { cn } from "@/lib/utils";

// Map route segment to page title
function getPageTitle(pathname) {
  if (pathname.endsWith("/users")) return "Users";
  if (pathname.endsWith("/settings")) return "Site Settings";
  if (pathname.endsWith("/account")) return "My Account";
  return "Overview";
}

export default function AdminTopbar({
  user,
  mobileSidebarOpen,
  onMobileToggle,
  onDesktopToggle,
}) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur-sm">
      {/* Mobile menu button */}
      <button
        onClick={onMobileToggle}
        aria-label="Toggle sidebar"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
      >
        {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Desktop collapse toggle */}
      <button
        onClick={onDesktopToggle}
        aria-label="Toggle sidebar"
        className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:flex"
      >
        <Menu size={18} />
      </button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Admin &rsaquo; {title}
        </p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className={cn(
            "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors",
            "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications (UI only) */}
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-violet-500" />
        </button>

        {/* Admin avatar */}
        <div
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white shadow-md"
          aria-label={`Signed in as ${user?.fullName ?? "Admin"}`}
        >
          {user?.fullName?.charAt(0).toUpperCase() ?? "A"}
        </div>
      </div>
    </header>
  );
}
