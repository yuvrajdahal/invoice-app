"use client";
import { Trash2, ChevronDown, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/types/invoice.type";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  onDelete: (id: number) => void;
}

type SortField = 'invoiceNumber' | 'customer' | 'date' | 'dueDate' | 'amount' | 'status';
type SortDirection = 'asc' | 'desc' | null;

function InvoiceTable({ invoices, onDelete, isLoading }: InvoiceTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedInvoices = () => {
    if (!sortField || !sortDirection) return invoices;

    return [...invoices].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'date' || sortField === 'dueDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 ml-1 inline opacity-0 group-hover:opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3 w-3 ml-1 inline" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 inline" />
    );
  };

  const sortedInvoices = getSortedInvoices();

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "Paid":
        return "text-green-600 bg-green-50";
      case "Unpaid":
        return "text-yellow-600 bg-yellow-50";
      case "Overdue":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-teal-50">
            <TableHead className="w-10"></TableHead>
            <TableHead>
              <button
                onClick={() => handleSort('invoiceNumber')}
                className="flex items-center font-semibold hover:text-teal-700 group"
              >
                Invoice #
                <SortIcon field="invoiceNumber" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort('customer')}
                className="flex items-center font-semibold hover:text-teal-700 group"
              >
                Customer
                <SortIcon field="customer" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort('date')}
                className="flex items-center font-semibold hover:text-teal-700 group"
              >
                Date
                <SortIcon field="date" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort('dueDate')}
                className="flex items-center font-semibold hover:text-teal-700 group"
              >
                Due Date
                <SortIcon field="dueDate" />
              </button>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>
              <button
                onClick={() => handleSort('amount')}
                className="flex items-center font-semibold hover:text-teal-700 group"
              >
                Total
                <SortIcon field="amount" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort('status')}
                className="flex items-center font-semibold hover:text-teal-700 group"
              >
                Status
                <SortIcon field="status" />
              </button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                <div className="text-gray-500">
                  <p className="text-lg">Loading...</p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && invoices.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                <div className="text-gray-500">
                  <p className="text-lg">No invoices found</p>
                  <p className="text-sm mt-2">
                    Click "Create Invoice" to add your first invoice
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            sortedInvoices.map((invoice) => (
              <React.Fragment key={invoice.id}>
                <TableRow className="hover:bg-gray-50">
                  <TableCell>
                    <button
                      onClick={() => toggleRow(invoice.id)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label={
                        expandedRows.has(invoice.id)
                          ? "Collapse items"
                          : "Expand items"
                      }
                    >
                      {expandedRows.has(invoice.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {invoice.description}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${invoice.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(invoice.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      aria-label={`Delete invoice ${invoice.invoiceNumber}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>

                {expandedRows.has(invoice.id) && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={9} className="py-4">
                      <div className="ml-8">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          Invoice Items
                        </h3>
                        {invoice.items.length > 0 ? (
                          <div className="bg-white rounded-lg border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-100">
                                  <TableHead>Item</TableHead>
                                  <TableHead className="text-right">
                                    Quantity
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Price
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Total
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {invoice.items.map((item, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{item.item}</TableCell>
                                    <TableCell className="text-right">
                                      {item.qty}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      ${item.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                      ${(item.qty * item.price).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                                <TableRow className="bg-gray-50">
                                  <TableCell
                                    colSpan={3}
                                    className="text-right font-semibold"
                                  >
                                    Total:
                                  </TableCell>
                                  <TableCell className="text-right font-bold">
                                    ${invoice.amount.toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            No items added to this invoice
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default InvoiceTable;