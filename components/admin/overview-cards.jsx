"use client";

import { Users, DollarSign, Activity, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  users: Users,
  dollar: DollarSign,
  activity: Activity,
  trending: TrendingUp,
};

const COLOR_MAP = {
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
};

function StatCard({ stat }) {
  const Icon = ICON_MAP[stat.icon] ?? Activity;
  const iconClass = COLOR_MAP[stat.color] ?? COLOR_MAP.violet;
  const isUp = stat.trend === "up";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-6",
        "shadow-[0_2px_20px_rgba(0,0,0,0.06)] transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      )}
      aria-label={`${stat.label}: ${stat.value}`}
    >
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5" />
      </div>

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {stat.value}
          </p>
          <div
            className={cn(
              "mt-2 flex items-center gap-1 text-xs font-semibold",
              isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
            )}
          >
            {isUp ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            <span>{stat.change} from last month</span>
          </div>
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", iconClass)}>
          <Icon size={22} />
        </div>
      </div>
    </article>
  );
}

export default function OverviewCards({ stats }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Key metrics"
    >
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
