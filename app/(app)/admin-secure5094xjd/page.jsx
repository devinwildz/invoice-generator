import { Suspense } from "react";
import OverviewCards from "@/components/admin/overview-cards";
import RevenueChart from "@/components/admin/revenue-chart";
import ActivityFeed from "@/components/admin/activity-feed";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ADMIN_STATS, MONTHLY_REVENUE, RECENT_ACTIVITY } from "@/lib/admin-data";
import { OverviewCardsSkeleton, ChartSkeleton, ActivitySkeleton } from "@/components/admin/skeletons";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </header>

      {/* Stats Cards */}
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCards stats={ADMIN_STATS} />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Revenue Overview</CardTitle>
            <CardDescription>Monthly performance of invoice revenue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <div className="h-[250px] pt-4">
                <RevenueChart data={MONTHLY_REVENUE} />
              </div>
            </Suspense>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Recent Activities</CardTitle>
            <CardDescription>Platform events tracked over the last 24h.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ActivitySkeleton />}>
              <ActivityFeed activities={RECENT_ACTIVITY} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
