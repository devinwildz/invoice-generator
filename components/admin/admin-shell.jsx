"use client";

import { useState } from "react";
import { ThemeProvider } from "@/components/admin/theme-provider";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminTopbar from "@/components/admin/admin-topbar";
import { cn } from "@/lib/utils";

export default function AdminShell({ user, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden bg-background font-sans">
        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar — mobile drawer */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:hidden",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <AdminSidebar
            collapsed={false}
            onToggle={() => setMobileSidebarOpen(false)}
            user={user}
          />
        </div>

        {/* Sidebar — desktop */}
        <div className="hidden shrink-0 md:flex">
          <AdminSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((v) => !v)}
            user={user}
          />
        </div>

        {/* Main content area */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminTopbar
            user={user}
            mobileSidebarOpen={mobileSidebarOpen}
            onMobileToggle={() => setMobileSidebarOpen((v) => !v)}
            onDesktopToggle={() => setSidebarCollapsed((v) => !v)}
          />

          <main
            id="admin-main-content"
            className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"
          >
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
