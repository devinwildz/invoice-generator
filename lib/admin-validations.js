import { z } from "zod";

export const siteSettingsSchema = z.object({
  siteTitle: z
    .string()
    .min(2, "Site title must be at least 2 characters")
    .max(100, "Site title is too long"),
  footerText: z
    .string()
    .max(200, "Footer text is too long")
    .optional()
    .default(""),
  logo: z.string().optional(),
  favicon: z.string().optional(),
});

export const adminProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z.string().email("Enter a valid email address"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Include at least one letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
