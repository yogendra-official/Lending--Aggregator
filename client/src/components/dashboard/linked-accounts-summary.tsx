import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { Account } from "@shared/schema";
import { BankIcon, CreditCardIcon, InvestmentIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils";

export default function LinkedAccountsSummary() {
  const { data: accounts, isLoading } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  const getIconForAccountType = (type: string) => {
    switch (type.toLowerCase()) {
      case "bank":
        return (
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <BankIcon className="text-blue-600" size={20} />
          </div>
        );
      case "credit":
        return (
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <CreditCardIcon className="text-red-600" size={20} />
          </div>
        );
      case "investment":
        return (
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <InvestmentIcon className="text-green-600" size={20} />
          </div>
        );
      default:
        return (
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <BankIcon className="text-gray-600" size={20} />
          </div>
        );
    }
  };

  // Display max 3 accounts in the summary
  const displayAccounts = accounts?.slice(0, 3) || [];

  return (
    <Card>
      <CardHeader className="border-b border-gray-200 flex flex-row justify-between items-center">
        <CardTitle>Linked Accounts</CardTitle>
        <Link href="/linked-accounts">
          <a className="text-sm font-medium text-primary hover:text-primary-dark flex items-center">
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading skeleton
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center p-4 border border-gray-200 rounded-lg"
                >
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="ml-4">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-20 mt-1" />
                  </div>
                </div>
              ))}
            </>
          ) : accounts?.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No accounts linked yet</p>
              <Link href="/account-setup">
                <a className="mt-2 inline-block text-sm text-primary font-medium">
                  Link your first account
                </a>
              </Link>
            </div>
          ) : (
            displayAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex-shrink-0">
                  {getIconForAccountType(account.accountType)}
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    {account.institution}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} 
                    {" ••••" + account.accountNumber.slice(-4)}
                  </p>
                  <p className={`text-sm font-semibold mt-1 ${account.balance < 0 ? "text-red-500" : ""}`}>
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {!isLoading && accounts && accounts.length > 0 && accounts.length < 3 && (
          <div className="mt-5">
            <Link href="/account-setup">
              <a className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <PlusIcon className="mr-2 h-4 w-4" />
                Link another account
              </a>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Temporary import to avoid TypeScript error
import { PlusIcon } from "lucide-react";
