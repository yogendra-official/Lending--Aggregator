import { Account, Transaction, User } from "@shared/schema";

export interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface CategoryTotal {
  category: string;
  amount: number;
  percentage: number;
}

export interface BudgetItem {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  progress: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface InstitutionOption {
  id: string;
  name: string;
  logo: string;
  type: string;
}

export interface AccountWithTransactions extends Account {
  recentTransactions?: Transaction[];
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export type SortOrder = 'asc' | 'desc';

export interface TransactionFilters {
  search?: string;
  account?: number;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  sort?: string;
  order?: SortOrder;
  page?: number;
  limit?: number;
}
