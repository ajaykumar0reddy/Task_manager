import Database from 'better-sqlite3';
import path from 'path';

let dbInstance = null;

export function getDb() {
  if (!dbInstance) {
    const dbPath = path.join(process.cwd(), 'tasks.db');

    dbInstance = new Database(dbPath, {
      timeout: 5000
    });

    dbInstance.pragma('journal_mode = DELETE');

    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      )
    `);
  }

  return dbInstance;
}