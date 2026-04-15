import { cn } from "@/lib/utils";

export function BrandLogo({ logoUrl, siteTitle, className }) {
  return (
    <div className={cn(
      "flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg overflow-hidden",
      className
    )}>
      {logoUrl ? (
        <img src={logoUrl} alt={siteTitle} className="h-full w-full object-cover" />
      ) : (
        "I O"
      )}
    </div>
  );
}

export function BrandName({ siteTitle, className }) {
  return (
    <span className={cn("text-sm uppercase tracking-[0.3em] text-muted-foreground", className)}>
      {siteTitle}
    </span>
  );
}
