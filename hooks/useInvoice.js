"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchInvoiceById } from "@/services/invoices";

export function useInvoice(id) {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: () => fetchInvoiceById(id),
    enabled: Boolean(id),
  });
}
