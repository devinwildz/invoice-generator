import AppHeader from "@/components/app/app-header";
import AppFooter from "@/components/app/app-footer";

export default function AppShell({ user, children }) {
  return (
    <div className="min-h-screen bg-[rgba(226,232,240,0.3)]">
      <AppHeader user={user} />
      <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
      <AppFooter />
    </div>
  );
}
