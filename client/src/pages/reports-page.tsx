import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import SummaryCards from "@/components/reports/summary-cards";
import ExpenseChart from "@/components/reports/expense-chart";
import BarChart from "@/components/reports/bar-chart";
import BudgetProgress from "@/components/reports/budget-progress";
import BudgetEditor from "@/components/reports/budget-editor";
import CategoryBreakdown from "@/components/reports/category-breakdown";
import { Transaction, Account } from "@shared/schema";
import { ChartData, BudgetItem, CategoryTotal } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, FileSpreadsheet, FileText, Table } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState<string>("month");
  const [userBudgets, setUserBudgets] = useState<Record<string, number> | null>(null);
  
  // Fetch accounts data
  const { data: accounts, isLoading: accountsLoading } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });
  
  // Fetch transactions data
  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });
  
  // Filter transactions based on selected time range
  const getFilteredTransactions = () => {
    if (!transactions) return [];
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3month":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6month":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "ytd":
        startDate = new Date(now.getFullYear(), 0, 1); // January 1st of current year
        break;
      case "1year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return transactions.filter(t => new Date(t.date) >= startDate);
  };
  
  const filteredTransactions = getFilteredTransactions();
  
  // Calculate summary data
  const calculateSummaryData = () => {
    const income = filteredTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = Math.abs(
      filteredTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );
    
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    
    return {
      income,
      expenses,
      savings,
      savingsRate
    };
  };
  
  // Generate spending by category data for pie chart
  const generateCategoryData = (): ChartData[] => {
    if (!filteredTransactions.length) return [];
    
    const categoryMap = new Map<string, number>();
    
    // Collect expenses by category
    filteredTransactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        const category = t.category || "Uncategorized";
        const currentAmount = categoryMap.get(category) || 0;
        categoryMap.set(category, currentAmount + Math.abs(t.amount));
      });
    
    // Convert to chart data format
    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 categories
  };
  
  // Generate monthly income vs expenses data for bar chart
  const generateMonthlyComparisonData = () => {
    if (!filteredTransactions.length) return [];
    
    const monthlyData = new Map<string, { income: number; expenses: number }>();
    
    // Initialize with past 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData.set(monthKey, { income: 0, expenses: 0 });
    }
    
    // Collect data by month
    filteredTransactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (monthlyData.has(monthKey)) {
        const currentData = monthlyData.get(monthKey)!;
        if (t.amount > 0) {
          currentData.income += t.amount;
        } else {
          currentData.expenses += Math.abs(t.amount);
        }
        monthlyData.set(monthKey, currentData);
      }
    });
    
    // Convert to chart format
    return Array.from(monthlyData.entries()).map(([name, data]) => ({
      name,
      income: data.income,
      expenses: data.expenses
    }));
  };
  
  // Load saved budgets from localStorage on component mount
  useEffect(() => {
    try {
      const savedBudgets = localStorage.getItem('userBudgets');
      if (savedBudgets) {
        setUserBudgets(JSON.parse(savedBudgets));
      }
    } catch (error) {
      console.error("Error loading saved budgets:", error);
    }
  }, []);

  // Handle budget updates
  const handleBudgetUpdate = (updatedBudgets: Record<string, number>) => {
    setUserBudgets(updatedBudgets);
    try {
      localStorage.setItem('userBudgets', JSON.stringify(updatedBudgets));
    } catch (error) {
      console.error("Error saving budgets:", error);
      toast({
        title: "Error saving budgets",
        description: "There was an issue saving your budget settings.",
        variant: "destructive"
      });
    }
  };
  
  // Generate budget items with user-defined limits or defaults
  const generateBudgetItems = (): BudgetItem[] => {
    const expenses = filteredTransactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => {
        const category = t.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);
    
    // Default budget limits if user hasn't set any
    const defaultBudgets: Record<string, number> = {
      "Housing": 25000,
      "Food & Dining": 10000,
      "Transportation": 5000,
      "Shopping": 8000,
      "Bills & Utilities": 7000,
      "Entertainment": 6000
    };
    
    // Use user-defined budgets if available, otherwise use defaults
    const budgets = userBudgets || defaultBudgets;
    
    // Get all relevant categories (from both expenses and budgets)
    const allCategories = new Set([
      ...Object.keys(expenses),
      ...Object.keys(budgets)
    ]);
    
    return Array.from(allCategories).map(category => {
      const budgeted = budgets[category] || 0;
      const spent = expenses[category] || 0;
      return {
        category,
        budgeted,
        spent,
        remaining: budgeted - spent,
        progress: budgeted > 0 ? (spent / budgeted) * 100 : 0
      };
    }).sort((a, b) => b.spent - a.spent); // Sort by highest spending
  };
  
  // Generate category breakdown data
  const generateCategoryBreakdown = (): CategoryTotal[] => {
    if (!filteredTransactions.length) return [];
    
    const expenses = filteredTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const categoryMap = new Map<string, number>();
    
    // Collect expenses by category
    filteredTransactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        const category = t.category || "Uncategorized";
        const currentAmount = categoryMap.get(category) || 0;
        categoryMap.set(category, currentAmount + Math.abs(t.amount));
      });
    
    // Convert to category totals with percentages
    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / expenses) * 100
      }))
      .sort((a, b) => b.amount - a.amount);
  };
  
  const { income, expenses, savings, savingsRate } = calculateSummaryData();
  const categoryData = generateCategoryData();
  const monthlyComparisonData = generateMonthlyComparisonData();
  const budgetItems = generateBudgetItems();
  const categoryBreakdown = generateCategoryBreakdown();
  
  const isLoading = accountsLoading || transactionsLoading;
  const { toast } = useToast();
  
  // Function to generate and download CSV file
  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) {
      toast({
        title: "No data to export",
        description: "Please make sure there is data available for export.",
        variant: "destructive"
      });
      return;
    }
    
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','), // CSV header row
      ...data.map(row => 
        headers.map(header => {
          // Handle special cases for clean CSV output
          const value = row[header];
          if (value == null) return ''; 
          if (typeof value === 'number') return value;
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`; // Escape double quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: `${filename} has been downloaded.`
    });
  };
  
  // Export transactions in CSV format
  const exportTransactions = () => {
    if (!filteredTransactions.length) {
      toast({
        title: "No transactions to export",
        description: "There are no transactions for the selected period.",
        variant: "destructive"
      });
      return;
    }
    
    // Format transactions for export
    const formattedTransactions = filteredTransactions.map(t => {
      // Get account name from accountId
      const account = accounts?.find(a => a.id === t.accountId);
      
      return {
        Date: new Date(t.date).toLocaleDateString('en-IN'),
        Description: t.description,
        Category: t.category || 'Uncategorized',
        Amount: formatCurrency(t.amount),
        AmountValue: t.amount, // Raw value for sorting
        Type: t.amount >= 0 ? 'Income' : 'Expense',
        Account: account ? account.accountName : `Account #${t.accountId}`,
      };
    }).sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
    
    // Remove raw amount value before export
    const exportData = formattedTransactions.map(({ AmountValue, ...rest }) => rest);
    
    exportCSV(exportData, 'transactions');
  };
  
  // Export category summary
  const exportCategorySummary = () => {
    if (!categoryBreakdown.length) {
      toast({
        title: "No category data to export",
        description: "There is no category data for the selected period.",
        variant: "destructive"
      });
      return;
    }
    
    const exportData = categoryBreakdown.map(cat => ({
      Category: cat.category,
      Amount: formatCurrency(cat.amount),
      Percentage: `${cat.percentage.toFixed(2)}%`
    }));
    
    exportCSV(exportData, 'category_summary');
  };
  
  // Export budget performance
  const exportBudgetReport = () => {
    if (!budgetItems.length) {
      toast({
        title: "No budget data to export",
        description: "There is no budget data for the selected period.",
        variant: "destructive"
      });
      return;
    }
    
    const exportData = budgetItems.map(item => ({
      Category: item.category,
      Budgeted: formatCurrency(item.budgeted),
      Spent: formatCurrency(item.spent),
      Remaining: formatCurrency(item.remaining),
      'Progress (%)': `${item.progress.toFixed(1)}%`
    }));
    
    exportCSV(exportData, 'budget_performance');
  };

  return (
    <SidebarLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Reports & Insights</h1>
              <p className="mt-1 text-sm text-gray-600">Analyze your financial data with customized reports</p>
            </div>
            <div className="mt-4 md:mt-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="inline-flex items-center bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white border-none">
                    <Download className="mr-2 h-4 w-4" />
                    Export Reports
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={exportTransactions} className="cursor-pointer">
                    <Table className="mr-2 h-4 w-4" />
                    <span>Transactions</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportCategorySummary} className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Category Summary</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportBudgetReport} className="cursor-pointer">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Budget Report</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Date Range Selector */}
          <div className="mt-6 bg-white rounded-lg shadow p-4 flex flex-wrap items-center justify-between">
            <div className="flex items-center flex-grow mb-4 md:mb-0">
              <span className="text-sm font-medium text-gray-700 mr-3">Time Period:</span>
              <div className="relative w-40">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="3month">Last 3 Months</SelectItem>
                    <SelectItem value="6month">Last 6 Months</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                    <SelectItem value="1year">Last 12 Months</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center bg-white hover:bg-gray-50 text-teal-600 border-teal-300 hover:border-teal-500"
              onClick={() => {
                // Refresh data
                window.location.reload();
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          {/* Summary Cards */}
          <div className="mt-6">
            <SummaryCards 
              income={income}
              expenses={expenses}
              savings={savings}
              savingsRate={savingsRate}
              loading={isLoading}
            />
          </div>
          
          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <BarChart
              data={monthlyComparisonData}
              title="Income vs Expenses"
              loading={isLoading}
            />
            
            <ExpenseChart 
              data={categoryData}
              title="Spending by Category"
              loading={isLoading}
            />
          </div>
          
          {/* Category Breakdown */}
          <div className="mt-8">
            <CategoryBreakdown categories={categoryBreakdown} loading={isLoading} />
          </div>
          
          {/* Budget Performance */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Budget Performance</h2>
              <BudgetEditor budgetItems={budgetItems} onBudgetUpdate={handleBudgetUpdate} />
            </div>
            <BudgetProgress budgetItems={budgetItems} loading={isLoading} />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
