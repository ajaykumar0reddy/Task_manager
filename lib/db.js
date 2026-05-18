import Database from 'better-sqlite3';
import path from 'path';

// Connect to SQLite database or create if it doesn't exist
// Using a file in the root directory for easy access
const dbPath = path.join(process.cwd(), 'tasks.db');
const db = new Database(dbPath, { verbose: console.log });
db.pragma('journal_mode = WAL');

// Initialize database tables
const initDb = () => {
  const createTableStmt = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.exec(createTableStmt);
};

initDb();

export default db;
