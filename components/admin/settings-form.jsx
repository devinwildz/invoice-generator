"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSettingsSchema } from "@/lib/admin-validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";
import { Upload, X, Image as ImageIcon, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteSettings, useUpdateSiteSettings } from "@/hooks/useSiteSettings";

function FileUploadZone({ label, icon: Icon, id, accept, hint, value, onChange }) {
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </Label>
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-8 text-center transition-colors",
          "hover:border-primary/50 hover:bg-primary/5"
        )}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        {value || fileName ? (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon size={20} />
            </div>
            <p className="max-w-[200px] truncate text-sm font-medium text-foreground">
              {value || fileName}
            </p>
            <button
              type="button"
              onClick={(e) => { 
                e.stopPropagation(); 
                setFileName(null);
                onChange(""); 
              }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
            >
              <X size={12} /> Remove
            </button>
          </>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Upload size={20} />
            </div>
            <p className="text-sm font-medium text-foreground">
              Click to upload {label.toLowerCase()}
            </p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFileName(file.name);
            // In a real app, you'd upload to Supabase and get a URL here
            // For now, we'll just simulate by using the file name
            onChange(file.name);
          }
        }}
        aria-label={`Upload ${label}`}
      />
    </div>
  );
}

export default function SettingsForm() {
  const toast = useToast();
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteTitle: "Invoice Online",
      footerText: "",
      logo: "",
      favicon: "",
    },
  });

  // Load settings into form
  useEffect(() => {
    if (settings) {
      reset({
        siteTitle: settings.site_title,
        footerText: settings.footer_text,
        logo: settings.logo_url || "",
        favicon: settings.favicon_url || "",
      });
    }
  }, [settings, reset]);

  async function onSubmit(data) {
    try {
      await updateSettings.mutateAsync({
        site_title: data.siteTitle,
        footer_text: data.footerText,
        logo_url: data.logo,
        favicon_url: data.favicon,
      });
      toast.push("Settings saved successfully!", "success");
    } catch (err) {
      toast.push("Failed to save settings.", "error");
    }
  }

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading settings...</div>;

  const isSubmitting = updateSettings.isPending;

  return (
    <form
      id="site-settings-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
      noValidate
    >
      {/* General */}
      <section
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        aria-labelledby="general-settings-heading"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <Globe size={18} />
          </div>
          <div>
            <h2
              id="general-settings-heading"
              className="text-sm font-semibold text-foreground"
            >
              General
            </h2>
            <p className="text-xs text-muted-foreground">
              Basic information about your site
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Site Title */}
          <div>
            <Label
              htmlFor="siteTitle"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Site Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="siteTitle"
              {...register("siteTitle")}
              placeholder="My Invoice App"
              className={cn(errors.siteTitle && "border-destructive")}
              aria-describedby={errors.siteTitle ? "siteTitle-error" : undefined}
            />
            {errors.siteTitle && (
              <p
                id="siteTitle-error"
                role="alert"
                className="mt-1.5 text-xs font-medium text-destructive"
              >
                {errors.siteTitle.message}
              </p>
            )}
          </div>

          {/* Footer Text */}
          <div>
            <Label
              htmlFor="footerText"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Footer Text
            </Label>
            <Textarea
              id="footerText"
              {...register("footerText")}
              placeholder="© 2025 Your Company. All rights reserved."
              rows={3}
              className={cn(errors.footerText && "border-destructive")}
              aria-describedby={errors.footerText ? "footerText-error" : undefined}
            />
            {errors.footerText && (
              <p
                id="footerText-error"
                role="alert"
                className="mt-1.5 text-xs font-medium text-destructive"
              >
                {errors.footerText.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Branding */}
      <section
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        aria-labelledby="branding-settings-heading"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
            <ImageIcon size={18} />
          </div>
          <div>
            <h2
              id="branding-settings-heading"
              className="text-sm font-semibold text-foreground"
            >
              Branding
            </h2>
            <p className="text-xs text-muted-foreground">
              Upload your logo and favicon
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Controller
            name="logo"
            control={control}
            render={({ field }) => (
              <FileUploadZone
                id="logo-upload"
                label="Logo"
                icon={ImageIcon}
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                hint="PNG, JPG, SVG or WebP · Max 2MB"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="favicon"
            control={control}
            render={({ field }) => (
              <FileUploadZone
                id="favicon-upload"
                label="Favicon"
                icon={ImageIcon}
                accept="image/png,image/x-icon,image/svg+xml"
                hint="PNG, ICO or SVG · 32×32px recommended"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => reset()}
          disabled={!isDirty || isSubmitting}
        >
          Reset
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          id="save-settings-btn"
        >
          {isSubmitting ? "Saving…" : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
