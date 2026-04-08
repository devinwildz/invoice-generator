"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { invoiceSchema } from "@/lib/validations";
import { calculateTotals, generateInvoiceNumber } from "@/lib/invoice";
import {
  useCreateInvoice,
  useUpdateInvoice,
} from "@/hooks/useInvoiceMutations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InvoicePreview from "@/components/invoices/invoice-preview";

const emptyParty = {
  name: "",
  email: "",
  address: "",
  phone: "",
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
}

function buildInitialInvoice(initial) {
  if (initial) return initial;

  return {
    invoiceNumber: generateInvoiceNumber(),
    issueDate: getToday(),
    dueDate: getDueDate(),
    sender: { ...emptyParty },
    client: { ...emptyParty },
    items: [{ name: "Design services", quantity: 1, price: 0, total: 0 }],
    taxRate: 10,
    discount: 0,
    notes: "Thank you for your business.",
    currency: "USD",
    status: "draft",
  };
}

export default function InvoiceEditor({ mode, initialData }) {
  const router = useRouter();
  const previewRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(buildInitialInvoice(initialData));
  const [isExporting, setIsExporting] = useState(false);

  const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceMutation = useUpdateInvoice();

  const totals = useMemo(
    () => calculateTotals(form.items, form.taxRate, form.discount),
    [form.items, form.taxRate, form.discount]
  );

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateParty = useCallback((party, field, value) => {
    setForm((prev) => ({
      ...prev,
      [party]: {
        ...prev[party],
        [field]: value,
      },
    }));
  }, []);

  const updateItem = useCallback((index, field, value) => {
    setForm((prev) => {
      const items = prev.items.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const updated = { ...item, [field]: value };
        const quantity = Number(updated.quantity || 0);
        const price = Number(updated.price || 0);
        updated.total = quantity * price;
        return updated;
      });
      return { ...prev, items };
    });
  }, []);

  const addItem = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 1, price: 0, total: 0 }],
    }));
  }, []);

  const removeItem = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }, []);

  const handleExport = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    const html2pdf = (await import("html2pdf.js")).default;
    await html2pdf()
      .set({
        margin: 12,
        filename: `${form.invoiceNumber}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(previewRef.current)
      .save();
    setIsExporting(false);
  };

  const handleSubmit = async () => {
    setErrors({});
    const validated = invoiceSchema.safeParse(form);
    if (!validated.success) {
      setErrors(validated.error.flatten().fieldErrors);
      return;
    }

    const payload = {
      invoice_number: form.invoiceNumber,
      issue_date: form.issueDate,
      due_date: form.dueDate,
      currency: form.currency,
      tax_rate: form.taxRate,
      discount: form.discount,
      subtotal: totals.subtotal,
      tax_amount: totals.tax,
      total: totals.total,
      status: form.status,
      sender: form.sender,
      client: form.client,
      notes: form.notes,
      items: form.items.map((item) => ({
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
        total: Number(item.total),
      })),
    };

    if (mode === "edit") {
      await updateInvoiceMutation.mutateAsync({ id: form.id, payload });
    } else {
      await createInvoiceMutation.mutateAsync(payload);
    }

    router.push("/dashboard");
    router.refresh();
  };

  const isSaving = createInvoiceMutation.isPending || updateInvoiceMutation.isPending;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice number</Label>
                <Input
                  id="invoiceNumber"
                  value={form.invoiceNumber}
                  onChange={(event) => updateField("invoiceNumber", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={form.issueDate}
                  onChange={(event) => updateField("issueDate", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={(event) => updateField("dueDate", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                  value={form.currency}
                  onChange={(event) => updateField("currency", event.target.value)}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sender</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {Object.entries(form.sender).map(([key, value]) => (
              <div className="space-y-2" key={`sender-${key}`}>
                <Label htmlFor={`sender-${key}`}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>
                <Input
                  id={`sender-${key}`}
                  value={value}
                  onChange={(event) => updateParty("sender", key, event.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {Object.entries(form.client).map(([key, value]) => (
              <div className="space-y-2" key={`client-${key}`}>
                <Label htmlFor={`client-${key}`}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>
                <Input
                  id={`client-${key}`}
                  value={value}
                  onChange={(event) => updateParty("client", key, event.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.items.map((item, index) => (
              <div
                key={`item-${index}`}
                className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
              >
                <div className="space-y-2">
                  <Label>Item</Label>
                  <Input
                    value={item.name}
                    onChange={(event) => updateItem(index, "name", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(index, "quantity", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(event) => updateItem(index, "price", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total</Label>
                  <Input value={item.total} readOnly />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={form.items.length === 1}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addItem}>
              Add item
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Totals</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                step="0.01"
                value={form.taxRate}
                onChange={(event) => updateField("taxRate", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                step="0.01"
                value={form.discount}
                onChange={(event) => updateField("discount", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtotal</Label>
              <Input value={totals.subtotal.toFixed(2)} readOnly />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
            />
          </CardContent>
        </Card>

        {Object.keys(errors).length > 0 && (
          <div className="rounded-lg border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] p-4 text-sm text-destructive">
            Please review the highlighted fields before saving.
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save invoice"}
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </div>

      <div className="sticky top-6 self-start">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Live preview</h3>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Updated instantly
          </span>
        </div>
        <InvoicePreview ref={previewRef} invoice={form} totals={totals} />
      </div>
    </div>
  );
}
