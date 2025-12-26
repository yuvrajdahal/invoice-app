"use client";
import { getInvoices, createInvoice } from "@/services/invoice";
import {
  Invoice,
  CreateInvoiceInput,
  InvoicesResponse,
  CreateInvoiceResponse,
} from "@/types/invoice.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, ReactNode } from "react";
import { ApiError } from "@/lib/axios";
import { toast } from "sonner";

type TInvoiceContext = {
  invoices: Invoice[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  createInvoice: (invoiceData: CreateInvoiceInput) => void;
  isCreating: boolean;
};

const InvoiceContext = createContext<TInvoiceContext | undefined>(undefined);

export function InvoiceContextProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<
    InvoicesResponse,
    ApiError
  >({
    queryKey: ["invoices"],
    queryFn: getInvoices,
    retry: 1,
    staleTime: 30000,
  });

  const createInvoiceMutation = useMutation({
    mutationFn: (invoiceData: CreateInvoiceInput) => {
      return createInvoice(invoiceData);
    },
    onSuccess(data: CreateInvoiceResponse) {
      toast.success(data.message || "Invoice created successfully!");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError(error: ApiError) {
      console.error("Create invoice error:", error);
      toast.error(error.message || "Failed to create invoice");
    },
  });

  function handleCreateInvoice(invoiceData: CreateInvoiceInput) {
    createInvoiceMutation.mutate(invoiceData);
  }

  return (
    <InvoiceContext.Provider
      value={{
        invoices: data?.invoices || [],
        isLoading,
        isError,
        error: error || null,
        createInvoice: handleCreateInvoice,
        isCreating: createInvoiceMutation.isPending,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoice must be used within InvoiceContextProvider");
  }
  return context;
}
