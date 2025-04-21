import { springBootApiRequest } from './springboot-api-adapter';
import { Account, Transaction } from '@shared/schema';

/**
 * Adapter functions for Spring Boot API endpoints related to accounts and transactions
 */

// Map Spring Boot account model to frontend Account model
export function mapAccountFromSpringBoot(backendAccount: any): Account {
  return {
    id: backendAccount.id,
    userId: backendAccount.userId,
    accountName: backendAccount.accountName,
    accountType: backendAccount.accountType,
    institution: backendAccount.institution,
    balance: backendAccount.balance,
    accountNumber: backendAccount.accountNumber,
    createdAt: backendAccount.createdAt || new Date().toISOString(),
    lastUpdated: backendAccount.lastUpdated || new Date().toISOString(),
  };
}

// Map Spring Boot transaction model to frontend Transaction model
export function mapTransactionFromSpringBoot(backendTransaction: any): Transaction {
  return {
    id: backendTransaction.id,
    accountId: backendTransaction.accountId,
    description: backendTransaction.description,
    amount: backendTransaction.amount,
    date: new Date(backendTransaction.date),
    category: backendTransaction.category,
    createdAt: backendTransaction.createdAt ? new Date(backendTransaction.createdAt) : null,
  };
}

// Fetch all accounts for the current user
export async function fetchAccounts(): Promise<Account[]> {
  try {
    const response = await springBootApiRequest('GET', '/api/accounts', undefined);
    const accountsData = await response.json();
    return accountsData.map(mapAccountFromSpringBoot);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
}

// Fetch a single account by ID
export async function fetchAccount(accountId: number): Promise<Account> {
  try {
    const response = await springBootApiRequest('GET', `/api/accounts/${accountId}`, undefined);
    const accountData = await response.json();
    return mapAccountFromSpringBoot(accountData);
  } catch (error) {
    console.error(`Error fetching account ${accountId}:`, error);
    throw error;
  }
}

// Create a new account
export async function createAccount(accountData: Omit<Account, 'id' | 'userId' | 'createdAt' | 'lastUpdated'>): Promise<Account> {
  try {
    const response = await springBootApiRequest('POST', '/api/accounts', accountData);
    const newAccount = await response.json();
    return mapAccountFromSpringBoot(newAccount);
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

// Update an existing account
export async function updateAccount(accountId: number, accountData: Partial<Account>): Promise<Account> {
  try {
    const response = await springBootApiRequest('PUT', `/api/accounts/${accountId}`, accountData);
    const updatedAccount = await response.json();
    return mapAccountFromSpringBoot(updatedAccount);
  } catch (error) {
    console.error(`Error updating account ${accountId}:`, error);
    throw error;
  }
}

// Delete an account
export async function deleteAccount(accountId: number): Promise<boolean> {
  try {
    await springBootApiRequest('DELETE', `/api/accounts/${accountId}`, undefined);
    return true;
  } catch (error) {
    console.error(`Error deleting account ${accountId}:`, error);
    throw error;
  }
}

// Fetch all transactions for the current user
export async function fetchAllTransactions(): Promise<Transaction[]> {
  try {
    const response = await springBootApiRequest('GET', '/api/transactions', undefined);
    const transactionsData = await response.json();
    return transactionsData.map(mapTransactionFromSpringBoot);
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    throw error;
  }
}

// Fetch transactions for a specific account
export async function fetchAccountTransactions(accountId: number): Promise<Transaction[]> {
  try {
    const response = await springBootApiRequest('GET', `/api/accounts/${accountId}/transactions`, undefined);
    const transactionsData = await response.json();
    return transactionsData.map(mapTransactionFromSpringBoot);
  } catch (error) {
    console.error(`Error fetching transactions for account ${accountId}:`, error);
    throw error;
  }
}

// Create a new transaction
export async function createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
  try {
    const response = await springBootApiRequest('POST', '/api/transactions', transactionData);
    const newTransaction = await response.json();
    return mapTransactionFromSpringBoot(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

// Fetch transaction categories
export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await springBootApiRequest('GET', '/api/categories', undefined);
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// Fetch dashboard summary data
export async function fetchDashboardSummary() {
  try {
    const response = await springBootApiRequest('GET', '/api/dashboard/summary', undefined);
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
}

// Fetch recent activity
export async function fetchRecentActivity(limit: number = 10) {
  try {
    const response = await springBootApiRequest('GET', `/api/transactions/recent?limit=${limit}`, undefined);
    const transactions = await response.json();
    return transactions.map(mapTransactionFromSpringBoot);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
}

// Budget management APIs
export async function fetchBudgetItems() {
  try {
    const response = await springBootApiRequest('GET', '/api/budgets', undefined);
    return await response.json();
  } catch (error) {
    console.error('Error fetching budget items:', error);
    throw error;
  }
}

export async function updateBudgetItem(categoryId: string, amount: number) {
  try {
    const response = await springBootApiRequest('PUT', `/api/budgets/${categoryId}`, { amount });
    return await response.json();
  } catch (error) {
    console.error(`Error updating budget for category ${categoryId}:`, error);
    throw error;
  }
}

// Reports APIs
export async function fetchCategoryBreakdown(timeRange: string) {
  try {
    const response = await springBootApiRequest('GET', `/api/reports/category-breakdown?timeRange=${timeRange}`, undefined);
    return await response.json();
  } catch (error) {
    console.error('Error fetching category breakdown:', error);
    throw error;
  }
}

export async function fetchMonthlyComparison() {
  try {
    const response = await springBootApiRequest('GET', '/api/reports/monthly-comparison', undefined);
    return await response.json();
  } catch (error) {
    console.error('Error fetching monthly comparison:', error);
    throw error;
  }
}