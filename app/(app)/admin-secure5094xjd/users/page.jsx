import UsersClient from "@/components/admin/users-client";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">User Management</h2>
        <p className="text-sm text-muted-foreground">Manage platform users, roles, and account statuses.</p>
      </header>

      <UsersClient />
    </div>
  );
}
