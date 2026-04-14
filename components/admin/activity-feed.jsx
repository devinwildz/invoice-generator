"use client";

import { FileText, ArrowUpCircle, Download, Settings, UserPlus, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  invoice: {
    icon: FileText,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  upgrade: {
    icon: ArrowUpCircle,
    color: "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  },
  download: {
    icon: Download,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  settings: {
    icon: Settings,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
  signup: {
    icon: UserPlus,
    color: "bg-teal-100 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400",
  },
  security: {
    icon: Shield,
    color: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  },
};

function ActivityItem({ item }) {
  const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.settings;
  const Icon = config.icon;

  return (
    <li className="flex items-start gap-4 py-3">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          config.color
        )}
        aria-hidden="true"
      >
        <Icon size={15} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{item.user}</p>
        <p className="text-xs text-muted-foreground">{item.action}</p>
      </div>
      <time
        className="shrink-0 text-[11px] text-muted-foreground"
        dateTime={item.time}
      >
        {item.time}
      </time>
    </li>
  );
}

export default function ActivityFeed({ activities }) {
  if (!activities?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileText size={20} className="text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No recent activity</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Activities will appear here as users interact with the platform.
        </p>
      </div>
    );
  }

  return (
    <ul
      role="list"
      className="divide-y divide-border"
      aria-label="Recent activity feed"
    >
      {activities.map((item) => (
        <ActivityItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
