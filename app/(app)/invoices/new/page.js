import { requireUser } from "@/lib/auth";
import AppShell from "@/components/app/app-shell";
import InvoiceEditor from "@/components/invoices/invoice-editor";
import { generateInvoiceNumber } from "@/lib/invoice";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
}

export default async function NewInvoicePage() {
  const user = await requireUser();
  const initialData = {
    invoiceNumber: generateInvoiceNumber(),
    issueDate: getToday(),
    dueDate: getDueDate(),
    sender: { name: "", email: "", address: "", phone: "", logo: "" },
    client: { name: "", email: "", address: "", phone: "" },
    items: [{ name: "Design services", quantity: 1, price: 0, total: 0 }],
    taxRate: 10,
    discount: 0,
    notes: "Thank you for your business.",
    currency: "USD",
    status: "draft",
  };

  return (
    <AppShell user={user}>
      <div className="mb-6">
        <p className="text-xs uppercase mb-1 tracking-[0.3em] text-muted-foreground">
          New invoice
        </p>
        <h1 className="text-3xl capitalize font-semibold text-foreground">
          Create a professional invoice
        </h1>
      </div>
      <InvoiceEditor mode="create" initialData={initialData} />
    </AppShell>
  );
}
