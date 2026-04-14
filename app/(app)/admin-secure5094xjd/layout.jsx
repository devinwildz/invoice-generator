import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/admin/admin-shell";

export const metadata = {
  title: "Admin Dashboard | Invoice Studio",
  description: "Secure administrative console for Invoice Studio.",
};

export default async function AdminLayout({ children }) {
  const user = await requireAdmin();

  return (
    <AdminShell user={user}>
      {children}
    </AdminShell>
  );
}
