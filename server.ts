import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("chip_ng.db");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  }
});

// Email Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER || "demo@ethereal.email",
    pass: process.env.SMTP_PASS || "demo_pass",
  },
});

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    plan TEXT DEFAULT 'free',
    is_verified INTEGER DEFAULT 0,
    verification_token TEXT,
    subscription_status TEXT DEFAULT 'active',
    next_billing_date TEXT
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount INTEGER,
    currency TEXT DEFAULT 'NGN',
    status TEXT,
    date TEXT,
    plan TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS profiles (
    user_id INTEGER PRIMARY KEY,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    theme TEXT DEFAULT 'default',
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    url TEXT,
    icon TEXT,
    position INTEGER,
    color TEXT,
    clicks INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Migrations
try { db.exec("ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'active'"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN next_billing_date TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE profiles ADD COLUMN avatar_url TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE profiles ADD COLUMN theme TEXT DEFAULT 'default'"); } catch (e) {}
try { db.exec("ALTER TABLE links ADD COLUMN icon TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE links ADD COLUMN position INTEGER DEFAULT 0"); } catch (e) {}
try { db.exec("ALTER TABLE links ADD COLUMN color TEXT"); } catch (e) {}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Auth Endpoints
  app.post("/api/auth/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const verificationToken = crypto.randomBytes(32).toString("hex");
    
    try {
      const userResult = db.prepare("INSERT INTO users (username, email, password, verification_token) VALUES (?, ?, ?, ?)").run(username, email, password, verificationToken);
      const userId = userResult.lastInsertRowid;
      db.prepare("INSERT INTO profiles (user_id, display_name, bio) VALUES (?, ?, ?)").run(userId, username, `Welcome to ${username}'s Chip NG profile!`);
      
      // Send Verification Email
      const verifyUrl = `${process.env.APP_URL || "http://localhost:3000"}/verify/${verificationToken}`;
      
      const mailOptions = {
        from: process.env.SMTP_FROM || '"Chip NG" <noreply@chip.ng>',
        to: email,
        subject: "Verify your Chip NG account",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome to Chip NG!</h1>
            <p>Please verify your email address to activate your account.</p>
            <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email</a>
            <p>Or copy this link: ${verifyUrl}</p>
          </div>
        `,
      };

      // In a real app, we'd await this. For demo, we'll log it too.
      try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}. Link: ${verifyUrl}`);
      } catch (mailError) {
        console.error("Failed to send email:", mailError);
        // We still return success but log the error
      }

      res.json({ success: true, message: "Verification email sent" });
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ error: "Username or email already exists" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.post("/api/auth/verify/:token", (req, res) => {
    const { token } = req.params;
    const user = db.prepare("SELECT * FROM users WHERE verification_token = ?").get(token) as any;
    
    if (user) {
      db.prepare("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?").run(user.id);
      res.json({ success: true, message: "Email verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid or expired verification token" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    
    if (user) {
      if (user.is_verified === 0) {
        return res.status(403).json({ error: "Please verify your email address before logging in." });
      }
      res.json({ success: true, userId: user.id, username: user.username });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Middleware to get user from header (for demo simplicity)
  const getUserId = (req: express.Request) => {
    return req.headers["x-user-id"] ? parseInt(req.headers["x-user-id"] as string) : null;
  };

  app.get("/api/profile", (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const profile = db.prepare(`
      SELECT p.*, u.username, u.plan 
      FROM profiles p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.user_id = ?
    `).get(userId);
    res.json(profile);
  });

  app.get("/api/profile/:username", (req, res) => {
    const { username } = req.params;
    const profile = db.prepare(`
      SELECT p.*, u.username, u.plan 
      FROM profiles p 
      JOIN users u ON p.user_id = u.id 
      WHERE u.username = ?
    `).get(username);
    
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    
    const links = db.prepare("SELECT * FROM links WHERE user_id = ? AND active = 1 ORDER BY position ASC").all(profile.user_id);
    res.json({ ...profile, links });
  });

  app.post("/api/profile", (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { display_name, bio, avatar_url, theme } = req.body;
    db.prepare(`
      UPDATE profiles 
      SET display_name = ?, bio = ?, avatar_url = ?, theme = ? 
      WHERE user_id = ?
    `).run(display_name, bio, avatar_url, theme, userId);
    res.json({ success: true });
  });

  app.post("/api/profile/avatar", upload.single("avatar"), (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    db.prepare("UPDATE profiles SET avatar_url = ? WHERE user_id = ?").run(avatarUrl, userId);
    
    res.json({ success: true, avatarUrl });
  });

  app.get("/api/links", (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const links = db.prepare("SELECT * FROM links WHERE user_id = ? ORDER BY position ASC").all(userId);
    res.json(links);
  });

  app.post("/api/links", (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { title, url, icon } = req.body;
    const count = db.prepare("SELECT COUNT(*) as count FROM links WHERE user_id = ?").get(userId) as any;
    const result = db.prepare("INSERT INTO links (user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?)").run(userId, title, url, icon, count.count);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/links/:id", (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const { title, url, icon, active, position, color } = req.body;
    db.prepare(`
      UPDATE links 
      SET title = ?, url = ?, icon = ?, active = ?, position = ?, color = ? 
      WHERE id = ? AND user_id = ?
    `).run(title, url, icon, active, position, color, id, userId);
    res.json({ success: true });
  });

  app.put("/api/links/reorder", (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { links: newLinks } = req.body;
    
    const update = db.prepare("UPDATE links SET position = ? WHERE id = ? AND user_id = ?");
    
    const transaction = db.transaction((linksToUpdate) => {
      for (const link of linksToUpdate) {
        update.run(link.position, link.id, userId);
      }
    });

    transaction(newLinks);
    res.json({ success: true });
  });

  app.delete("/api/links/:id", (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    db.prepare("DELETE FROM links WHERE id = ? AND user_id = ?").run(id, userId);
    res.json({ success: true });
  });

  app.get("/api/subscription", (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = db.prepare("SELECT plan, subscription_status, next_billing_date FROM users WHERE id = ?").get(userId) as any;
    const payments = db.prepare("SELECT * FROM payments WHERE user_id = ? ORDER BY date DESC").all(userId);
    
    res.json({
      ...user,
      payments
    });
  });

  app.post("/api/links/:id/click", (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE links SET clicks = clicks + 1 WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
