import AppHeader from "@/components/app/app-header";

export default function AppShell({ user, children }) {
  return (
    <div className="min-h-screen ">
      <AppHeader user={user} />
      <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
