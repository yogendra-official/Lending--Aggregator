import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import SummaryCard from "@/components/dashboard/summary-card";
import RecentActivity from "@/components/dashboard/recent-activity";
import QuickActions from "@/components/dashboard/quick-actions";
import LinkedAccountsSummary from "@/components/dashboard/linked-accounts-summary";
import { Account, Transaction } from "@shared/schema";
import { WalletIcon, IncomeIcon, ExpenseIcon, BankIcon, CreditCardIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils";
import { HoverGlowEffect } from "@/components/ui/cursor-effect";

export default function DashboardPage() {
  // Fetch accounts data
  const { 
    data: accounts, 
    isLoading: accountsLoading 
  } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  // Fetch transactions data
  const { 
    data: transactions, 
    isLoading: transactionsLoading 
  } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  // Calculate dashboard metrics
  const calculateDashboardSummary = () => {
    // Total balance across all accounts
    const totalBalance = accounts?.reduce((sum, account) => sum + account.balance, 0) || 0;
    
    // Calculate income and expenses for the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Filter transactions for current month
    const currentMonthTransactions = transactions?.filter(
      (t) => new Date(t.date) >= startOfMonth
    ) || [];
    
    // Calculate income (positive amounts) and expenses (negative amounts)
    const monthlyIncome = currentMonthTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = Math.abs(
      currentMonthTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );
    
    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses
    };
  };

  const { totalBalance, monthlyIncome, monthlyExpenses } = calculateDashboardSummary();
  
  // Get recent transactions (last 5)
  const recentTransactions = transactions
    ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5) || [];
    
  // Indian financial institutions
  const indianBanks = [
    { name: "State Bank of India", icon: BankIcon, color: "blue" },
    { name: "HDFC Bank", icon: BankIcon, color: "red" },
    { name: "ICICI Bank", icon: BankIcon, color: "orange" },
    { name: "Axis Bank", icon: BankIcon, color: "purple" },
    { name: "Kotak Mahindra Bank", icon: BankIcon, color: "red" },
    { name: "Bank of Baroda", icon: BankIcon, color: "green" },
    { name: "Punjab National Bank", icon: BankIcon, color: "blue" },
    { name: "Canara Bank", icon: BankIcon, color: "yellow" }
  ];

  return (
    <SidebarLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          
          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <HoverGlowEffect>
              <SummaryCard
                title="Total Balance"
                value={formatCurrency(totalBalance)}
                icon={<WalletIcon />}
                iconBgClass="indian-gradient-1"
                iconColor="text-white"
                linkText="View all accounts"
                linkUrl="/linked-accounts"
                loading={accountsLoading}
              />
            </HoverGlowEffect>
            
            <HoverGlowEffect>
              <SummaryCard
                title="Monthly Income"
                value={formatCurrency(monthlyIncome)}
                icon={<IncomeIcon />}
                iconBgClass="indian-gradient-2"
                iconColor="text-white"
                linkText="View income report"
                linkUrl="/reports"
                loading={accountsLoading || transactionsLoading}
              />
            </HoverGlowEffect>
            
            <HoverGlowEffect>
              <SummaryCard
                title="Monthly Expenses"
                value={formatCurrency(monthlyExpenses)}
                icon={<ExpenseIcon />}
                iconBgClass="indian-gradient-3"
                iconColor="text-white"
                linkText="View expense report"
                linkUrl="/reports"
                loading={accountsLoading || transactionsLoading}
              />
            </HoverGlowEffect>
          </div>
          
          {/* Recent Activity & Quick Actions */}
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <RecentActivity 
                transactions={recentTransactions} 
                loading={transactionsLoading}
              />
            </div>
            
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActions />
            </div>
          </div>
          
          {/* Indian Financial Institutions */}
          <div className="mt-8">
            <div className="bg-white animate-fade-in-up rounded-xl shadow-md overflow-hidden hover-card">
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Popular Indian Financial Institutions
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {indianBanks.map((bank, index) => (
                    <div key={index} className="stagger-item">
                      <HoverGlowEffect>
                        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm transition-all hover:-translate-y-1">
                          <div className={`rounded-full p-2 mr-2 indian-gradient-${(index % 3) + 1}`}>
                            <bank.icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm font-medium">{bank.name}</span>
                        </div>
                      </HoverGlowEffect>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Linked Accounts Summary */}
          <div className="mt-8">
            <LinkedAccountsSummary />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
