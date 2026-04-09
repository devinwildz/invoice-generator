"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useInvoices } from "@/hooks/useInvoices";
import { useDeleteInvoice } from "@/hooks/useInvoiceMutations";
import { formatCurrency } from "@/lib/invoice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusVariant = {
  draft: "secondary",
  sent: "warning",
  paid: "success",
};

export default function DashboardClient() {
  const { data: invoices = [], isLoading } = useInvoices();
  const deleteMutation = useDeleteInvoice();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);

  const filtered = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesQuery =
        invoice.invoice_number?.toLowerCase().includes(query.toLowerCase()) ||
        invoice.client?.name?.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || invoice.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [invoices, query, status]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-6">
          <div className="flex-1">
            <Input
              placeholder="Search by client or invoice number"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <select
            className="h-10 cursor-pointer rounded-md border border-input bg-background px-3 text-sm text-foreground"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option className="cursor-pointer" value="all">All status</option>
            <option className="cursor-pointer" value="draft">Draft</option>
            <option className="cursor-pointer" value="sent">Sent</option>
            <option className="cursor-pointer" value="paid">Paid</option>
          </select>
          <Link href="/invoices/new">
            <Button>New Invoice</Button>
          </Link>
        </CardContent> 
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center">
                    Loading invoices...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center">
                    No invoices found. Create your first invoice.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Issued {invoice.issue_date}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {invoice.client?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {invoice.client?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.due_date}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[invoice.status] || "secondary"}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/invoices/${invoice.id}`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPendingDelete(invoice)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.4)] px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
            <h3 className="text-lg font-semibold text-foreground">
              Delete invoice?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This will permanently delete invoice{" "}
              <span className="font-medium text-foreground">
                {pendingDelete.invoice_number}
              </span>{" "}
              and its line items.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setPendingDelete(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteMutation.mutate(pendingDelete.id, {
                    onSuccess: () => setPendingDelete(null),
                  });
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
