"use client";

import { cn } from "@/lib/utils";

export default function RevenueChart({ data }) {
  const max = Math.max(...data.map((d) => d.value));

  // Current month highlighted (last item)
  const currentMonth = data[data.length - 1]?.month;

  return (
    <div
      className="flex h-full w-full flex-col"
      role="img"
      aria-label="Monthly revenue bar chart"
    >
      {/* Y-axis labels */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">$0</span>
        <span className="text-xs text-muted-foreground">
          ${(max / 1000).toFixed(0)}k
        </span>
      </div>

      {/* Bars */}
      <div className="flex flex-1 items-end gap-[3px]" aria-hidden="true">
        {data.map((d) => {
          const heightPct = (d.value / max) * 100;
          const isCurrent = d.month === currentMonth;

          return (
            <div
              key={d.month}
              className="group relative flex flex-1 flex-col items-center"
            >
              {/* Tooltip */}
              <div
                className={cn(
                  "absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1",
                  "bg-slate-900 text-[10px] font-semibold text-white",
                  "opacity-0 transition-opacity group-hover:opacity-100",
                  "pointer-events-none z-10"
                )}
              >
                ${(d.value / 1000).toFixed(1)}k
              </div>

              {/* Bar */}
              <div
                className={cn(
                  "w-full rounded-t-md transition-all duration-500",
                  isCurrent
                    ? "bg-gradient-to-t from-violet-600 to-violet-400"
                    : "bg-gradient-to-t from-primary/50 to-primary/30 group-hover:from-primary/70 group-hover:to-primary/50"
                )}
                style={{ height: `${heightPct}%`, minHeight: "4px" }}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="mt-2 flex gap-[3px]">
        {data.map((d) => (
          <div key={d.month} className="flex-1 text-center">
            <span
              className={cn(
                "text-[10px] font-medium",
                d.month === currentMonth
                  ? "font-bold text-violet-600 dark:text-violet-400"
                  : "text-muted-foreground"
              )}
            >
              {d.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
