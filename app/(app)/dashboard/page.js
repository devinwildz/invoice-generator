import { requireUser } from "@/lib/auth";
import AppShell from "@/components/app/app-shell";
import DashboardClient from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <AppShell user={user}>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Overview
        </p>
        <h1 className="text-3xl font-semibold text-foreground">
          Your invoices
        </h1>
      </div>
      <DashboardClient />
    </AppShell>
  );
}
