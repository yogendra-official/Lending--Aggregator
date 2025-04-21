import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { InsertAccount, InsertTransaction } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API routes
  // Accounts
  app.get("/api/accounts", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const accounts = await storage.getAccounts(req.user.id);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accounts" });
    }
  });

  app.get("/api/accounts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const account = await storage.getAccount(parseInt(req.params.id));
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      // Verify ownership
      if (account.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this account" });
      }
      
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch account" });
    }
  });

  app.post("/api/accounts", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const accountData: InsertAccount = {
        accountName: req.body.accountName,
        accountType: req.body.accountType,
        institution: req.body.institution,
        accountNumber: req.body.accountNumber,
        balance: req.body.balance,
      };
      
      const account = await storage.createAccount({
        ...accountData,
        userId: req.user.id
      });
      
      res.status(201).json(account);
    } catch (error) {
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.delete("/api/accounts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const account = await storage.getAccount(parseInt(req.params.id));
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      // Verify ownership
      if (account.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this account" });
      }
      
      await storage.deleteAccount(account.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // Transactions
  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const transactions = await storage.getAllUserTransactions(req.user.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/accounts/:id/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const account = await storage.getAccount(parseInt(req.params.id));
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      // Verify ownership
      if (account.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this account" });
      }
      
      const transactions = await storage.getTransactions(account.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const transactionData: InsertTransaction = {
        accountId: req.body.accountId,
        description: req.body.description,
        amount: req.body.amount,
        date: new Date(req.body.date),
        category: req.body.category,
      };
      
      // Verify account ownership
      const account = await storage.getAccount(transactionData.accountId);
      if (!account || account.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have access to this account" });
      }
      
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // User profile
  app.get("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      // Exclude password from response
      const { password, ...userProfile } = req.user;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const { password, ...updateData } = req.body;
      const updatedUser = await storage.updateUser(req.user.id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Exclude password from response
      const { password: _, ...userProfile } = updatedUser;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
