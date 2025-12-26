import api from "@/lib/axios";

import {
  Invoice,
  CreateInvoiceInput,
  InvoicesResponse,
  CreateInvoiceResponse,
} from "@/types/invoice.type";

export function getInvoices() {
  return new Promise<InvoicesResponse>((resolve, reject) => {
    api
      .get<InvoicesResponse>("invoices")
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function createInvoice(invoiceData: CreateInvoiceInput) {
  return new Promise<CreateInvoiceResponse>((resolve, reject) => {
    api
      .post<CreateInvoiceResponse>("invoices", {
        customer: invoiceData.customer,
        date: invoiceData.date,
        dueDate: invoiceData.dueDate,
        description: invoiceData.description,
        items: invoiceData.items,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getInvoiceById(id: number) {
  return new Promise<Invoice>((resolve, reject) => {
    api
      .get<Invoice>(`invoices/${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function updateInvoice(
  id: number,
  invoiceData: Partial<CreateInvoiceInput>
) {
  return new Promise<CreateInvoiceResponse>((resolve, reject) => {
    api
      .put<CreateInvoiceResponse>(`invoices/${id}`, invoiceData)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function deleteInvoice(id: number) {
  return new Promise<{ message: string }>((resolve, reject) => {
    api
      .delete<{ message: string }>(`invoices/${id}`)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
