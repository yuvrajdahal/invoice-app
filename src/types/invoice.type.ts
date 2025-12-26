export interface InvoiceItem {
  item: string;
  qty: number;
  price: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customer: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Overdue";
  description: string;
  items: InvoiceItem[];
}

export interface CreateInvoiceInput {
  customer: string;
  date: string;
  dueDate: string;
  description?: string;
  items: InvoiceItem[];
}

export interface InvoicesResponse {
  message: string;
  user: {
    id: number;
    username: string;
  };
  invoices: Invoice[];
}

export interface CreateInvoiceResponse {
  message: string;
  invoice: Invoice;
}