"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export async function fetchInvoices() {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("invoices")
    .select(
      "id, invoice_number, issue_date, due_date, currency, subtotal, tax_amount, discount, total, status, client, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchInvoiceById(id) {
  const supabase = createSupabaseBrowserClient();
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select(
      "id, invoice_number, issue_date, due_date, currency, tax_rate, subtotal, tax_amount, discount, total, status, sender, client, notes"
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  const { data: items, error: itemsError } = await supabase
    .from("invoice_items")
    .select("id, name, quantity, price, total")
    .eq("invoice_id", id)
    .order("created_at", { ascending: true });

  if (itemsError) throw itemsError;

  return { ...invoice, items: items ?? [] };
}

export async function createInvoice(payload) {
  const supabase = createSupabaseBrowserClient();
  const { items, ...invoice } = payload;

  const { data: invoiceRow, error } = await supabase
    .from("invoices")
    .insert(invoice)
    .select()
    .single();

  if (error) throw error;

  const itemsToInsert = (items ?? []).map((item) => ({
    invoice_id: invoiceRow.id,
    ...item,
  }));

  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(itemsToInsert);

  if (itemsError) throw itemsError;

  return invoiceRow;
}

export async function updateInvoice(id, payload) {
  const supabase = createSupabaseBrowserClient();
  const { items, ...invoice } = payload;

  const { error } = await supabase.from("invoices").update(invoice).eq("id", id);
  if (error) throw error;

  const { error: deleteError } = await supabase
    .from("invoice_items")
    .delete()
    .eq("invoice_id", id);

  if (deleteError) throw deleteError;

  const itemsToInsert = (items ?? []).map((item) => ({
    invoice_id: id,
    ...item,
  }));

  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(itemsToInsert);

  if (itemsError) throw itemsError;

  return id;
}

export async function deleteInvoice(id) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) throw error;
  return id;
}
