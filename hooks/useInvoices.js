"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchInvoices } from "@/services/invoices";

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
  });
}
