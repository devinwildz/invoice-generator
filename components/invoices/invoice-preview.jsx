"use client";

import * as React from "react";
import { formatCurrency } from "@/lib/invoice";

const InvoicePreview = React.forwardRef(function InvoicePreview(
  { invoice, totals },
  ref,
) {
  const { sender, client, items, invoiceNumber, issueDate, dueDate, currency } =
    invoice;

  return (
    <div
      ref={ref}
      className="rounded-2xl border p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
        color: "#0f172a",
      }}
    >
      <div
        className="flex flex-wrap items-start justify-between gap-6 pb-6"
        style={{ borderBottom: "1px solid #e2e8f0" }}
      >
        <div>
          {sender.logo && (
            <div className="flex items-start mb-5">
              <img
                src={sender.logo}
                alt="Sender logo"
                className="h-12 object-contain"
              />
            </div>
          )}
          <p
            className="text-xs uppercase mb-1 tracking-[0.2em]"
            style={{ color: "#94a3b8" }}
          >
            Invoice
          </p>

          <h2 className="text-3xl font-semibold" style={{ color: "#0f172a" }}>
            {invoiceNumber}
          </h2>
          <div className="mt-4 space-y-1 text-sm" style={{ color: "#475569" }}>
            <p>
              <span className="font-medium" style={{ color: "#1e293b" }}>
                Issue date:
              </span>{" "}
              {issueDate}
            </p>
            <p>
              <span className="font-medium" style={{ color: "#1e293b" }}>
                Due date:
              </span>{" "}
              {dueDate}
            </p>
          </div>
        </div>

        <div
          className="rounded-xl px-6 py-4 text-right"
          style={{ backgroundColor: "#f8fafc" }}
        >
          <p
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "#94a3b8" }}
          >
            Total due
          </p>
          <p
            className="mt-2 text-3xl font-semibold"
            style={{ color: "#0f172a" }}
          >
            {formatCurrency(totals.total, currency)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 pt-6 md:grid-cols-2">
        <div>
          <p
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "#94a3b8" }}
          >
            From
          </p>
          <div className="mt-3 space-y-1 text-sm" style={{ color: "#334155" }}>
            <p className="font-semibold wrap-break-word" style={{ color: "#0f172a" }}>
              {sender.name}
            </p>
            <p className="wrap-break-word">{sender.address}</p>
            <p>{sender.email}</p>
            <p>{sender.phone}</p>
          </div>
        </div>

        <div>
          <p
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "#94a3b8" }}
          >
            Bill to
          </p>
          <div className="mt-3 space-y-1 text-sm" style={{ color: "#334155" }}>
            <p className="font-semibold wrap-break-word" style={{ color: "#0f172a" }}>
              {client.name}
            </p>
            <p className="wrap-break-word">{client.address}</p>
            <p>{client.email}</p>
            <p>{client.phone}</p>
          </div>
        </div>
      </div>

      <div
        className="mt-8 overflow-hidden rounded-xl border"
        style={{ borderColor: "#e2e8f0" }}
      >
        <table className="w-full text-left text-sm">
          <thead
            className="text-xs uppercase tracking-wide"
            style={{ backgroundColor: "#f8fafc", color: "#64748b" }}
          >
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={`${item.name}-${index}`}
                style={{ borderBottom: "1px solid #e2e8f0" }}
              >
                <td className="px-4 py-3" style={{ color: "#334155" }}>
                  {item.name}
                </td>
                <td
                  className="px-4 py-3 text-right"
                  style={{ color: "#475569" }}
                >
                  {item.quantity}
                </td>
                <td
                  className="px-4 py-3 text-right"
                  style={{ color: "#475569" }}
                >
                  {formatCurrency(item.price, currency)}
                </td>
                <td
                  className="px-4 py-3 text-right font-medium"
                  style={{ color: "#0f172a" }}
                >
                  {formatCurrency(item.total, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="mt-6 flex flex-col gap-4 pt-6 md:flex-row md:items-start md:justify-between"
        style={{ borderTop: "1px solid #e2e8f0" }}
      >
        <div className="max-w-sm text-sm" style={{ color: "#475569" }}>
          <p
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "#94a3b8" }}
          >
            Notes
          </p>
          <p className="mt-2 whitespace-pre-line">{invoice.notes || "-"}</p>
        </div>
        <div
          className="w-full max-w-xs space-y-2 text-sm"
          style={{ color: "#334155" }}
        >
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-medium" style={{ color: "#0f172a" }}>
              {formatCurrency(totals.subtotal, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <span className="font-medium" style={{ color: "#0f172a" }}>
              {formatCurrency(totals.tax, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span className="font-medium" style={{ color: "#0f172a" }}>
              {formatCurrency(invoice.discount, currency)}
            </span>
          </div>
          <div
            className="flex items-center justify-between pt-2 text-base font-semibold"
            style={{ borderTop: "1px solid #e2e8f0", color: "#0f172a" }}
          >
            <span>Total</span>
            <span>{formatCurrency(totals.total, currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InvoicePreview;
