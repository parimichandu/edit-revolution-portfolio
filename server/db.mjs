import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const dataDir = path.resolve(projectRoot, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.resolve(dataDir, 'financial.db');
export const db = new DatabaseSync(dbPath);

// Enable WAL mode for high concurrency & reliability
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initialize all database tables and default initial configuration.
 */
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS savings_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      target_amount REAL NOT NULL,
      starting_balance REAL NOT NULL DEFAULT 0,
      target_duration_months INTEGER NOT NULL DEFAULT 3,
      planned_monthly_savings REAL NOT NULL DEFAULT 5000,
      target_deadline TEXT NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      goal_type TEXT NOT NULL DEFAULT 'Personal savings',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS savings_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('deposit', 'withdrawal')),
      amount REAL NOT NULL CHECK(amount > 0),
      date TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS client_incomes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      project_name TEXT NOT NULL,
      amount REAL NOT NULL CHECK(amount > 0),
      date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('received', 'pending')),
      invoice_number TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('business', 'personal')),
      amount REAL NOT NULL CHECK(amount > 0),
      date TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS feedback_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      client_name TEXT NOT NULL,
      client_contact TEXT,
      project_title TEXT NOT NULL,
      deliverable_type TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'submitted', 'expired')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      submitted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS client_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id INTEGER UNIQUE NOT NULL REFERENCES feedback_requests(id) ON DELETE CASCADE,
      client_name TEXT NOT NULL,
      project_title TEXT NOT NULL,
      overall_rating INTEGER NOT NULL CHECK(overall_rating BETWEEN 1 AND 5),
      quality_rating INTEGER NOT NULL CHECK(quality_rating BETWEEN 1 AND 5),
      communication_rating INTEGER NOT NULL CHECK(communication_rating BETWEEN 1 AND 5),
      delivery_rating INTEGER NOT NULL CHECK(delivery_rating BETWEEN 1 AND 5),
      written_review TEXT,
      allow_public_display INTEGER NOT NULL DEFAULT 0 CHECK(allow_public_display IN (0, 1)),
      status TEXT NOT NULL DEFAULT 'pending_review' CHECK(status IN ('pending_review', 'approved', 'rejected', 'archived')),
      admin_notes TEXT,
      private_response TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      moderated_at TEXT
    );
  `);

  // Seed default savings goal if none exists
  const existingGoal = db.prepare('SELECT id FROM savings_goals LIMIT 1').get();
  if (!existingGoal) {
    // 3 months from today as initial deadline
    const deadlineDate = new Date();
    deadlineDate.setMonth(deadlineDate.getMonth() + 3);
    const deadlineIso = deadlineDate.toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO savings_goals (
        name, target_amount, starting_balance, target_duration_months,
        planned_monthly_savings, target_deadline, currency, goal_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'My First ₹1 Lakh Savings',
      100000,
      0,
      3,
      5000,
      deadlineIso,
      'INR',
      'Personal savings'
    );
  }
}

initDatabase();
