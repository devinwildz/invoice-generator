"use client";

import * as React from "react";
import { formatCurrency } from "@/lib/invoice";

const InvoicePreview = React.forwardRef(function InvoicePreview(
  { invoice, totals },
  ref
) {
  const { sender, client, items, invoiceNumber, issueDate, dueDate, currency } =
    invoice;

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Invoice
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            {invoiceNumber}
          </h2>
          <div className="mt-4 space-y-1 text-sm text-slate-600">
            <p>
              <span className="font-medium text-slate-800">Issue date:</span>{" "}
              {issueDate}
            </p>
            <p>
              <span className="font-medium text-slate-800">Due date:</span>{" "}
              {dueDate}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 px-6 py-4 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Total due
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {formatCurrency(totals.total, currency)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 pt-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            From
          </p>
          <div className="mt-3 space-y-1 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{sender.name}</p>
            <p>{sender.address}</p>
            <p>{sender.email}</p>
            <p>{sender.phone}</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Bill to
          </p>
          <div className="mt-3 space-y-1 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{client.name}</p>
            <p>{client.address}</p>
            <p>{client.email}</p>
            <p>{client.phone}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item, index) => (
              <tr key={`${item.name}-${index}`}>
                <td className="px-4 py-3 text-slate-700">{item.name}</td>
                <td className="px-4 py-3 text-right text-slate-600">
                  {item.quantity}
                </td>
                <td className="px-4 py-3 text-right text-slate-600">
                  {formatCurrency(item.price, currency)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">
                  {formatCurrency(item.total, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm text-sm text-slate-600">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Notes
          </p>
          <p className="mt-2 whitespace-pre-line">{invoice.notes || "-"}</p>
        </div>
        <div className="w-full max-w-xs space-y-2 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(totals.subtotal, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(totals.tax, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(invoice.discount, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(totals.total, currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InvoicePreview;
