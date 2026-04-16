import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), "data", "sqlite.db");
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
    try {
        fs.mkdirSync(dbDir, { recursive: true });
    } catch (e) {
        console.error("Failed to create database directory:", e);
    }
}

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
