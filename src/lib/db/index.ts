import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), "data", "sqlite.db");
const dbDir = path.dirname(dbPath);

// Only try to create the directory if we're not in a read-only environment
if (!fs.existsSync(dbDir)) {
    try {
        fs.mkdirSync(dbDir, { recursive: true });
    } catch (e) {
        // During build, this might fail, which is okay as long as we don't crash here
        console.warn("Notice: Could not create DB directory (expected during build phase):", dbDir);
    }
}

// Initialize SQLite. In some build environments, we might need to fallback to memory if the file is inaccessible
let sqlite;
try {
    sqlite = new Database(dbPath);
} catch (e) {
    console.warn("Notice: Falling back to in-memory database for build phase.");
    sqlite = new Database(":memory:");
}

export const db = drizzle(sqlite, { schema });
