import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "financial-aggregator-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        console.log("LocalStrategy authenticating:", email);
        try {
          const user = await storage.getUserByEmail(email);
          console.log("User lookup result:", user ? "found" : "not found");
          
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          
          const passwordValid = await comparePasswords(password, user.password);
          console.log("Password validation:", passwordValid ? "valid" : "invalid");
          
          if (!passwordValid) {
            return done(null, false, { message: "Invalid password" });
          }
          
          return done(null, user);
        } catch (error) {
          console.log("LocalStrategy error:", error);
          return done(error);
        }
      }
    ),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    console.log("Register request received:", req.body);
    try {
      const existingUser = await storage.getUserByEmail(req.body.email);
      if (existingUser) {
        console.log("Email already exists:", req.body.email);
        return res.status(400).send("Email already exists");
      }

      console.log("Creating new user with email:", req.body.email);
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...safeUser } = user;
        res.status(201).json(safeUser);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("Login request received:", req.body);
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.log("Login error:", err);
        return next(err);
      }
      if (!user) {
        console.log("Login failed - no user:", info);
        return res.status(401).json({ message: info && info.message ? info.message : "Authentication failed" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.log("Login session error:", loginErr);
          return next(loginErr);
        }
        
        console.log("User logged in successfully:", user.email);
        const { password, ...safeUser } = user;
        return res.status(200).json(safeUser);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user) {
      const { password, ...safeUser } = req.user;
      res.json(safeUser);
    } else {
      res.sendStatus(401);
    }
  });
}
