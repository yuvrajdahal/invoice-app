"use client";

import { InvoiceContextProvider } from "@/contexts/InvoiceContext";
import ProtectedRoute from "@/contexts/ProtectedRoutes";


function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <InvoiceContextProvider>{children}</InvoiceContextProvider>
    </ProtectedRoute>
  );
}

export default DashboardLayout;
