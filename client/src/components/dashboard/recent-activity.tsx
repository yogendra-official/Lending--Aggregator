import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";
import { ShoppingIcon, FoodIcon, IncomeIcon } from "@/components/ui/icons";

interface RecentActivityProps {
  transactions: Transaction[];
  loading?: boolean;
}

// Helper function to get icon based on category
const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case "shopping":
      return <ShoppingIcon className="text-gray-600" />;
    case "food & dining":
      return <FoodIcon className="text-gray-600" />;
    case "income":
      return <IncomeIcon className="text-gray-600" />;
    default:
      return <ShoppingIcon className="text-gray-600" />;
  }
};

export default function RecentActivity({ transactions, loading = false }: RecentActivityProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-3 sm:px-6">
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {[1, 2, 3].map((_, index) => (
                <li key={index} className="py-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-12 mt-1" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <Skeleton className="h-9 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format transactions for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const transactionDate = new Date(date);
    
    if (
      transactionDate.getDate() === now.getDate() &&
      transactionDate.getMonth() === now.getMonth() &&
      transactionDate.getFullYear() === now.getFullYear()
    ) {
      return `Today, ${transactionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    if (
      transactionDate.getDate() === now.getDate() - 1 &&
      transactionDate.getMonth() === now.getMonth() &&
      transactionDate.getFullYear() === now.getFullYear()
    ) {
      return `Yesterday, ${transactionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return transactionDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
           `, ${transactionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-3 sm:px-6">
        <div className="flow-root">
          {transactions.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-gray-500">No recent transactions to display</p>
            </div>
          ) : (
            <ul className="-my-5 divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {getCategoryIcon(transaction.category || "")}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500 truncate">Account ID: {transaction.accountId}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${
                        transaction.amount < 0 ? "text-red-500" : "text-green-500"
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6">
          <Link href="/transactions">
            <Button variant="outline" className="w-full">
              View all transactions
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
