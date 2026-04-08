import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AppShell from "@/components/app/app-shell";
import InvoiceEditor from "@/components/invoices/invoice-editor";

export default async function EditInvoicePage({ params }) {
  const { id } = await params;
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select(
      "id, invoice_number, issue_date, due_date, currency, tax_rate, discount, status, sender, client, notes"
    )
    .eq("id", id)
    .single();

  if (error || !invoice) {
    notFound();
  }

  const { data: items } = await supabase
    .from("invoice_items")
    .select("id, name, quantity, price, total")
    .eq("invoice_id", id)
    .order("created_at", { ascending: true });

  const initialData = {
    id: invoice.id,
    invoiceNumber: invoice.invoice_number,
    issueDate: invoice.issue_date,
    dueDate: invoice.due_date,
    sender: {
      name: "",
      email: "",
      address: "",
      phone: "",
      ...(invoice.sender ?? {}),
    },
    client: {
      name: "",
      email: "",
      address: "",
      phone: "",
      ...(invoice.client ?? {}),
    },
    items: (items ?? []).map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    })),
    taxRate: invoice.tax_rate ?? 0,
    discount: invoice.discount ?? 0,
    notes: invoice.notes ?? "",
    currency: invoice.currency ?? "USD",
    status: invoice.status ?? "draft",
  };

  return (
    <AppShell user={user}>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Edit invoice
        </p>
        <h1 className="text-3xl font-semibold text-foreground">
          Update invoice details
        </h1>
      </div>
      <InvoiceEditor mode="edit" initialData={initialData} />
    </AppShell>
  );
}
