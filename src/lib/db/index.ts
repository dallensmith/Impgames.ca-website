import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

let sqlite;
try {
    const isProd = process.env.NODE_ENV === "production";
    const defaultPath = isProd ? "/data/sqlite.db" : "sqlite.db";
    sqlite = new Database(process.env.DATABASE_URL || defaultPath);
} catch (e) {
    console.warn("Notice: Using in-memory database fallback.");
    sqlite = new Database(":memory:");
}

export const db = drizzle(sqlite, { schema });
