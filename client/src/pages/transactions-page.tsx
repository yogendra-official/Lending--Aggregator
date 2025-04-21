import { useEffect } from "react";
import { useLocation } from "wouter";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import TransactionTable from "@/components/transactions/transaction-table";

export default function TransactionsPage() {
  const [location] = useLocation();
  
  // Extract query parameters
  const params = new URLSearchParams(location.split('?')[1]);
  const accountId = params.get('accountId') ? parseInt(params.get('accountId')!) : undefined;

  return (
    <SidebarLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
              <p className="mt-1 text-sm text-gray-600">
                View and manage your transaction history
              </p>
            </div>
          </div>
          
          {/* Transaction Table */}
          <div className="mt-6">
            <TransactionTable accountId={accountId} />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
