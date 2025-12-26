"use client";
import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import InvoiceTable from "./components/Invoice/InvoiceTable";
import InvoiceForm from "./components/Invoice/InvoiceForm";
import { useInvoice } from "@/contexts/InvoiceContext";
import { CreateInvoiceInput, Invoice } from "@/types/invoice.type";
import { toast } from "sonner";

export default function InvoiceList() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>([]);
  const { invoices, isLoading, createInvoice } = useInvoice();

  useEffect(() => {
    setLocalInvoices(invoices);
  }, [invoices]);

  const handleCreate = (invoiceData: CreateInvoiceInput) => {
    createInvoice(invoiceData);
  };

  const handleDelete = (id: number) => {
    setLocalInvoices((prevInvoices) =>
      prevInvoices.filter((invoice) => invoice.id !== id)
    );
    setDeleteId(null);
    toast.success("Invoice deleted successfully");
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="max-w-7xl w-full mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
              <p className="text-gray-500 mt-1">
                Manage your invoice list{" "}
                {localInvoices.length > 0 && `(${localInvoices.length} total)`}
              </p>
            </div>
            <InvoiceForm buttonName="Create Invoice" onSubmit={handleCreate} />
          </div>

          <InvoiceTable
            invoices={localInvoices}
            isLoading={isLoading}
            onDelete={(id) => setDeleteId(id)}
          />
        </div>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              invoice from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId !== null && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
