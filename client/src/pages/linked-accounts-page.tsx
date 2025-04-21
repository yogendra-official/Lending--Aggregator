import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import AccountListItem from "@/components/linked-accounts/account-list-item";
import { Link } from "wouter";
import { Account } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LinkedAccountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const { toast } = useToast();
  
  // Fetch accounts data
  const { 
    data: accounts, 
    isLoading 
  } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async (accountId: number) => {
      await apiRequest("DELETE", `/api/accounts/${accountId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      toast({
        title: "Account removed",
        description: "The account has been successfully removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove account",
        description: error.message || "An error occurred while removing the account.",
        variant: "destructive",
      });
    },
  });

  // Handle account deletion
  const handleDeleteAccount = (accountId: number) => {
    deleteAccountMutation.mutate(accountId);
  };

  // Filter accounts by search term and account type
  const filteredAccounts = accounts?.filter(account => {
    const matchesSearch = !searchTerm || 
      account.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = accountTypeFilter === "all" || 
      account.accountType.toLowerCase() === accountTypeFilter.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  // Group accounts by type
  const groupedAccounts = filteredAccounts?.reduce((acc, account) => {
    const type = account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1);
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(account);
    return acc;
  }, {} as Record<string, Account[]>) || {};

  return (
    <SidebarLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Linked Accounts</h1>
              <p className="mt-1 text-sm text-gray-600">Manage all your financial accounts in one place</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/account-setup">
                <Button className="inline-flex items-center">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Link New Account
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Search & Filter */}
          <div className="mt-6 flex flex-col sm:flex-row">
            <div className="flex-1 flex mb-4 sm:mb-0 sm:mr-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  className="pl-10"
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:flex-shrink-0">
              <Select
                value={accountTypeFilter}
                onValueChange={setAccountTypeFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Account Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Account Types</SelectItem>
                  <SelectItem value="bank">Bank Accounts</SelectItem>
                  <SelectItem value="credit">Credit Cards</SelectItem>
                  <SelectItem value="investment">Investment Accounts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Accounts List */}
          <div className="mt-6">
            {isLoading ? (
              // Loading state
              <div className="space-y-8">
                {[1, 2].map((group) => (
                  <div key={group}>
                    <Skeleton className="h-7 w-40 mb-4" />
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      {[1, 2].map((item) => (
                        <div key={item} className="px-4 py-4 sm:px-6 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="ml-4">
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="mr-6 text-right">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-3 w-32" />
                              </div>
                              <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : accounts?.length === 0 ? (
              // No accounts state
              <div className="bg-white shadow-md rounded-lg p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts linked yet</h3>
                <p className="text-gray-600 mb-6">
                  Link your first financial account to get started with tracking your finances.
                </p>
                <Link href="/account-setup">
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Link Your First Account
                  </Button>
                </Link>
              </div>
            ) : filteredAccounts?.length === 0 ? (
              // No matching accounts state
              <div className="bg-white shadow-md rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matching accounts found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria to see more results.
                </p>
              </div>
            ) : (
              // Account groups
              <div className="space-y-8">
                {Object.entries(groupedAccounts).map(([type, accountsList]) => (
                  <div key={type}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{type} Accounts</h3>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      <ul className="divide-y divide-gray-200">
                        {accountsList.map(account => (
                          <AccountListItem 
                            key={account.id} 
                            account={account} 
                            onDelete={handleDeleteAccount}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
