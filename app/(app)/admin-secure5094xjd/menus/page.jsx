import MenusClient from "@/components/admin/menus-client";

export default function MenusPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Menu Management</h2>
        <p className="text-sm text-muted-foreground">Manage header and footer navigation links.</p>
      </header>

      <MenusClient />
    </div>
  );
}
