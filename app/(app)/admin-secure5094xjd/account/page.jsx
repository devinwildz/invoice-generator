import { requireAdmin } from "@/lib/auth";
import AccountClient from "@/components/admin/account-client";

export default async function AdminAccountPage() {
  const user = await requireAdmin();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">My Account</h2>
        <p className="text-sm text-muted-foreground">Manage your personal information and security settings.</p>
      </header>

      <AccountClient user={user} />
    </div>
  );
}