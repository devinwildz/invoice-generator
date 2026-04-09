export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground">
        <span>© {year} Invoice Onlineinit. All rights reserved.</span>
        <span>Crafted for modern teams.</span>
      </div>
    </footer>
  );
}