import Database from 'better-sqlite3';
import path from 'path';

let db;

export function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'tasks.db');

    db = new Database(dbPath, {
      timeout: 5000
    });

    try {
      db.pragma('journal_mode = DELETE');
    } catch (err) {
      console.log('DB pragma warning:', err.message);
    }
  }

  return db;
}