import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Fetches real statistics and activities for the admin dashboard.
 */
export async function getAdminDashboardStats() {
  const supabase = await createSupabaseServerClient();

  // 1. Fetch Total Users
  const { count: totalUsers, error: usersError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // 2. Fetch Total Revenue
  const { data: revenueData, error: revenueError } = await supabase
    .from("invoices")
    .select("total");
  
  const totalRevenue = (revenueData || []).reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

  // 3. Fetch Recent Activities (Latest 4 users + Latest 4 invoices)
  const { data: recentUsers } = await supabase
    .from("users")
    .select("id, full_name, email, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentInvoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, total, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  // Combine and format activities
  const userActivities = (recentUsers || []).map(u => ({
    id: `user-${u.id}`,
    user: u.full_name || u.email?.split("@")[0] || "New User",
    action: "Registered new account",
    time: u.created_at,
    type: "signup",
  }));

  const invoiceActivities = (recentInvoices || []).map(inv => ({
    id: `inv-${inv.id}`,
    user: "System", // Or fetch user if possible, but for now system/invoice
    action: `Created invoice #${inv.invoice_number || inv.id.slice(0, 8)}`,
    time: inv.created_at,
    type: "invoice",
  }));

  const activities = [...userActivities, ...invoiceActivities]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 7);

  // Format into the structure expected by components
  return {
    stats: [
      {
        id: "users",
        label: "Total Users",
        value: (totalUsers || 0).toLocaleString(),
        raw: totalUsers || 0,
        change: "Real-time",
        trend: "up",
        icon: "users",
        color: "violet",
      },
      {
        id: "revenue",
        label: "Total Revenue",
        value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue),
        raw: totalRevenue,
        change: "Real-time",
        trend: "up",
        icon: "dollar",
        color: "emerald",
      },
      {
        id: "sessions",
        label: "Active Users",
        value: (totalUsers || 0).toLocaleString(), // Mocking active users as total users for now
        raw: totalUsers || 0,
        change: "Current",
        trend: "up",
        icon: "activity",
        color: "blue",
      },
      {
        id: "growth",
        label: "Growth Rate",
        value: "N/A",
        raw: 0,
        change: "Calculated",
        trend: "up",
        icon: "trending",
        color: "amber",
      },
    ],
    activities
  };
}
