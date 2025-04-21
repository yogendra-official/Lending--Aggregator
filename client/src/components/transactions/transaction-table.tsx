import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Transaction, Account } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingIcon, FoodIcon, IncomeIcon, HousingIcon, TransportIcon, UtilitiesIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight, Download, Filter, Search } from "lucide-react";

interface TransactionTableProps {
  accountId?: number;
}

// Helper function to get icon based on category
const getCategoryIcon = (category: string | null) => {
  if (!category) return <ShoppingIcon className="text-gray-600 h-4 w-4" />;
  
  switch (category.toLowerCase()) {
    case "shopping":
      return <ShoppingIcon className="text-blue-600 h-4 w-4" />;
    case "food & dining":
      return <FoodIcon className="text-yellow-600 h-4 w-4" />;
    case "income":
      return <IncomeIcon className="text-green-600 h-4 w-4" />;
    case "housing":
      return <HousingIcon className="text-purple-600 h-4 w-4" />;
    case "transportation":
      return <TransportIcon className="text-blue-600 h-4 w-4" />;
    case "bills & utilities":
      return <UtilitiesIcon className="text-green-600 h-4 w-4" />;
    default:
      return <ShoppingIcon className="text-gray-600 h-4 w-4" />;
  }
};

// Helper function to get category badge styling
const getCategoryBadge = (category: string | null) => {
  if (!category) return "bg-gray-100 text-gray-800";
  
  switch (category.toLowerCase()) {
    case "shopping":
      return "bg-blue-100 text-blue-800";
    case "food & dining":
      return "bg-yellow-100 text-yellow-800";
    case "income":
      return "bg-green-100 text-green-800";
    case "housing":
      return "bg-purple-100 text-purple-800";
    case "transportation":
      return "bg-blue-100 text-blue-800";
    case "bills & utilities":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TransactionTable({ accountId }: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string>(accountId?.toString() || "all");
  const [timeRange, setTimeRange] = useState("month");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { data: accounts, isLoading: accountsLoading } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: accountId 
      ? [`/api/accounts/${accountId}/transactions`] 
      : ["/api/transactions"],
  });

  // Filter and sort transactions
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = searchTerm === "" ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAccount = selectedAccount === "all" || 
      transaction.accountId === parseInt(selectedAccount);
    
    // Time range filtering
    const now = new Date();
    const transactionDate = new Date(transaction.date);
    let dateMatches = true;
    
    if (timeRange === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      dateMatches = transactionDate >= weekAgo;
    } else if (timeRange === "month") {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      dateMatches = transactionDate >= monthAgo;
    } else if (timeRange === "quarter") {
      const quarterAgo = new Date(now);
      quarterAgo.setMonth(now.getMonth() - 3);
      dateMatches = transactionDate >= quarterAgo;
    } else if (timeRange === "year") {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      dateMatches = transactionDate >= yearAgo;
    }
    
    return matchesSearch && matchesAccount && dateMatches;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];
  
  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Getting account name
  const getAccountName = (accountId: number) => {
    const account = accounts?.find(a => a.id === accountId);
    return account ? `${account.institution} (${account.accountName})` : `Account #${accountId}`;
  };

  // Formatting date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (accountsLoading || transactionsLoading) {
    return (
      <div className="bg-white shadow rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="sm:w-1/2 mb-3 sm:mb-0">
              <Skeleton className="h-10 w-full sm:w-3/4" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <Skeleton className="h-10 w-full mb-5" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {accountId ? 'Account Transactions' : 'All Transactions'}
        </h3>
      </div>
      
      {/* Search & Filter */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="sm:w-1/2 mb-3 sm:mb-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                type="text"
                placeholder="Search transactions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {!accountId && (
            <div>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="All Accounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Accounts</SelectItem>
                    {accounts?.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.institution} ({account.accountName})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="quarter">Last 90 days</SelectItem>
                  <SelectItem value="year">Last 12 months</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <Table>
          {filteredTransactions.length === 0 && (
            <TableCaption>No transactions found.</TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              {!accountId && <TableHead>Account</TableHead>}
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-gray-50">
                <TableCell className="text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                    </div>
                  </div>
                </TableCell>
                {!accountId && (
                  <TableCell className="text-sm text-gray-500">
                    {getAccountName(transaction.accountId)}
                  </TableCell>
                )}
                <TableCell>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryBadge(transaction.category)}`}>
                    {transaction.category || "Uncategorized"}
                  </span>
                </TableCell>
                <TableCell className={`text-sm font-medium text-right ${
                  transaction.amount < 0 ? "text-red-500" : "text-green-500"
                }`}>
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredTransactions.length)}</span> to{" "}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of{" "}
                <span className="font-medium">{filteredTransactions.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-l-md"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {/* Page numbers - show max 5 pages + first and last */}
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  const showPageNumber = pageNumber === 1 || 
                                         pageNumber === totalPages || 
                                         (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);
                  
                  if (!showPageNumber) {
                    if (pageNumber === 2 || pageNumber === totalPages - 1) {
                      return (
                        <Button
                          key={pageNumber}
                          variant="outline"
                          size="sm"
                          className="hidden md:inline-flex"
                          disabled
                        >
                          ...
                        </Button>
                      );
                    }
                    return null;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "default" : "outline"}
                      size="sm"
                      className={pageNumber === currentPage ? "bg-primary text-white" : ""}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-r-md"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
