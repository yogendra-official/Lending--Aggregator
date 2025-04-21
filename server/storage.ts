import { users, accounts, transactions } from "@shared/schema";
import type { User, InsertUser, Account, InsertAccount, Transaction, InsertTransaction } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);
type SessionStore = ReturnType<typeof createMemoryStore>;

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  
  // Account operations
  getAccounts(userId: number): Promise<Account[]>;
  getAccount(id: number): Promise<Account | undefined>;
  createAccount(account: InsertAccount & { userId: number }): Promise<Account>;
  updateAccount(id: number, data: Partial<InsertAccount>): Promise<Account | undefined>;
  deleteAccount(id: number): Promise<boolean>;
  
  // Transaction operations
  getTransactions(accountId: number): Promise<Transaction[]>;
  getAllUserTransactions(userId: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Session store
  sessionStore: ReturnType<typeof createMemoryStore>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private accounts: Map<number, Account>;
  private transactions: Map<number, Transaction>;
  public sessionStore: ReturnType<typeof createMemoryStore>;
  private userIdCounter: number;
  private accountIdCounter: number;
  private transactionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.accounts = new Map();
    this.transactions = new Map();
    this.userIdCounter = 1;
    this.accountIdCounter = 1;
    this.transactionIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 1 day
    });
    
    // Initialize with some sample accounts and transactions
    this.seedSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    console.log("Searching for user with email:", email);
    console.log("Current users:", Array.from(this.users.values()).map(u => ({id: u.id, email: u.email})));
    
    const user = Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
    
    console.log("User found:", user ? `ID: ${user.id}, Email: ${user.email}` : "None");
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    
    // Make sure username is a string or null, not undefined
    const username = insertUser.username === undefined ? null : insertUser.username;
    
    // Ensure firstName, lastName and phone are strings or null, not undefined
    const firstName = insertUser.firstName === undefined ? null : insertUser.firstName;
    const lastName = insertUser.lastName === undefined ? null : insertUser.lastName;
    const phone = insertUser.phone === undefined ? null : insertUser.phone;
    
    // Create user with properly typed fields
    const user: User = { 
      id,
      email: insertUser.email,
      password: insertUser.password,
      username: username,
      firstName: firstName, 
      lastName: lastName,
      phone: phone,
      createdAt: now
    };
    
    console.log("Creating user:", { id: user.id, email: user.email, username: user.username });
    this.users.set(id, user);
    
    // Generate sample data for the new user
    await this.seedDataForUser(user.id);
    
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) {
      return undefined;
    }
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Account operations
  async getAccounts(userId: number): Promise<Account[]> {
    return Array.from(this.accounts.values()).filter(
      (account) => account.userId === userId,
    );
  }

  async getAccount(id: number): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  async createAccount(account: InsertAccount & { userId: number }): Promise<Account> {
    const id = this.accountIdCounter++;
    const now = new Date();
    const newAccount: Account = {
      ...account,
      id,
      lastUpdated: now,
      createdAt: now
    };
    this.accounts.set(id, newAccount);
    return newAccount;
  }

  async updateAccount(id: number, data: Partial<InsertAccount>): Promise<Account | undefined> {
    const account = await this.getAccount(id);
    if (!account) {
      return undefined;
    }
    
    const updatedAccount = { 
      ...account, 
      ...data,
      lastUpdated: new Date()
    };
    this.accounts.set(id, updatedAccount);
    return updatedAccount;
  }

  async deleteAccount(id: number): Promise<boolean> {
    return this.accounts.delete(id);
  }

  // Transaction operations
  async getTransactions(accountId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((transaction) => transaction.accountId === accountId)
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort newest first
  }

  async getAllUserTransactions(userId: number): Promise<Transaction[]> {
    const userAccounts = await this.getAccounts(userId);
    const accountIds = userAccounts.map(account => account.id);
    
    return Array.from(this.transactions.values())
      .filter((transaction) => accountIds.includes(transaction.accountId))
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort newest first
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    const newTransaction: Transaction = {
      ...transaction,
      id,
      createdAt: now
    };
    this.transactions.set(id, newTransaction);
    
    // Update account balance
    const account = await this.getAccount(transaction.accountId);
    if (account) {
      const newBalance = account.balance + transaction.amount;
      await this.updateAccount(account.id, { balance: newBalance });
    }
    
    return newTransaction;
  }

  // Helper method to seed data (only for demo)
  private seedSampleData() {
    // This will be called when a new user is created via createUser
    // We'll automatically add sample Indian banks and transactions for the new user
  }

  // Add sample data for a new user
  async seedDataForUser(userId: number) {
    console.log(`Seeding data for user ID: ${userId} - generating Indian banks and transactions...`);
    // Define Indian bank accounts
    const indianBanks = [
      {
        accountName: "HDFC Bank Savings",
        accountType: "savings",
        institution: "HDFC Bank",
        accountNumber: "XXXX4567",
        balance: 128500.75,
        userId
      },
      {
        accountName: "SBI Current Account",
        accountType: "checking",
        institution: "State Bank of India",
        accountNumber: "XXXX7890",
        balance: 45000.50,
        userId
      },
      {
        accountName: "ICICI Investment",
        accountType: "investment",
        institution: "ICICI Bank",
        accountNumber: "XXXX2345",
        balance: 250000.00,
        userId
      }
    ];

    // Create accounts
    const createdAccounts = [];
    for (const bankData of indianBanks) {
      const account = await this.createAccount(bankData);
      createdAccounts.push(account);
    }

    // Define transaction categories with Indian context
    const categories = [
      "Groceries", "Dining", "Transportation", "Shopping", 
      "Entertainment", "Utilities", "Medical", "Education",
      "Housing", "Insurance", "Investments", "Salary"
    ];

    // Sample merchants with Indian context
    const merchants = {
      "Groceries": ["Big Bazaar", "Reliance Fresh", "DMart", "Nature's Basket", "Spencers"],
      "Dining": ["Taj Restaurant", "Haldiram's", "Saravana Bhavan", "Barbeque Nation", "Mainland China"],
      "Transportation": ["Ola", "Uber", "Indian Railways", "IndiGo Airlines", "Petrol Pump"],
      "Shopping": ["Shoppers Stop", "Myntra", "Flipkart", "Amazon India", "Reliance Digital"],
      "Entertainment": ["PVR Cinemas", "BookMyShow", "Netflix India", "Hotstar", "Wonderla"],
      "Utilities": ["Tata Power", "Jio Recharge", "Airtel Bill", "BSNL", "Water Board"],
      "Medical": ["Apollo Pharmacy", "Max Hospital", "Fortis Healthcare", "Medplus", "Practo"],
      "Education": ["BYJU'S", "Unacademy", "Coursera", "School Fees", "Book Store"],
      "Housing": ["Housing Society", "Rent Payment", "Home Loan EMI", "Property Tax", "Interior Design"],
      "Insurance": ["LIC India", "Bajaj Allianz", "ICICI Prudential", "HDFC Life", "Max Life"],
      "Investments": ["Zerodha", "Groww", "HDFC Mutual Fund", "SBI Mutual Fund", "Fixed Deposit"],
      "Salary": ["Salary Credit", "Bonus", "Income"]
    };

    // Generate transactions for the past 60 days
    const today = new Date();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(today.getDate() - 60);

    for (const account of createdAccounts) {
      // Number of transactions per account (20-40)
      const transactionCount = 20 + Math.floor(Math.random() * 20);
      
      for (let i = 0; i < transactionCount; i++) {
        // Random date in the past 60 days
        const transactionDate = new Date(
          sixtyDaysAgo.getTime() + Math.random() * (today.getTime() - sixtyDaysAgo.getTime())
        );
        
        // Random category
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        // Random merchant based on category
        const merchantList = merchants[category as keyof typeof merchants];
        const merchant = merchantList[Math.floor(Math.random() * merchantList.length)];
        
        // Amount (negative for expenses, positive for income)
        let amount: number;
        if (category === "Salary") {
          // Salary is income (positive amount)
          amount = 30000 + Math.floor(Math.random() * 50000);
        } else if (category === "Investments") {
          // Investments can be either expense or income
          amount = Math.random() > 0.7 
            ? 1000 + Math.floor(Math.random() * 10000) // income (returns)
            : -1000 - Math.floor(Math.random() * 20000); // expense (new investment)
        } else {
          // Most other categories are expenses (negative amount)
          amount = -100 - Math.floor(Math.random() * 5000);
        }
        
        // Create the transaction
        await this.createTransaction({
          accountId: account.id,
          amount,
          date: transactionDate,
          description: merchant,
          category
        });
      }
    }
  }
}

export const storage = new MemStorage();
