import SettingsForm from "@/components/admin/settings-form";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Site Settings</h2>
        <p className="text-sm text-muted-foreground">Configure global application settings and branding.</p>
      </header>

      <SettingsForm />
    </div>
  );
}
