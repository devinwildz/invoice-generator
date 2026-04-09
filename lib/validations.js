import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Include at least one letter")
    .regex(/[0-9]/, "Include at least one number"),
});

export const partySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(1, "Address is required"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .min(10, "Phone number must be exactly 10 digits"),
  logo: z.string().optional(),
});

export const invoiceItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  total: z.coerce.number().min(0, "Total must be 0 or more").optional(),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required").max(20, "Invoice number is too long"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  sender: partySchema,
  client: partySchema,
  items: z.array(invoiceItemSchema).min(1, "Add at least one line item"),
  taxRate: z.coerce.number().min(0, "Tax must be 0 or more"),
  discount: z.coerce.number().min(0, "Discount must be 0 or more"),
  notes: z.string().max(200, "Notes are too long").optional(),
  currency: z.enum(["USD", "EUR", "GBP", "INR", "AED", "CAD", "AUD", "SGD"]),
});
