const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), "data", "sqlite.db");
const db = new Database(dbPath);

console.log('Initializing database at:', dbPath);

// Create tables
db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        description TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        summary TEXT,
        status TEXT DEFAULT 'draft',
        cover_image TEXT,
        zip_url TEXT,
        version TEXT,
        release_date TEXT,
        changelog TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS gallery_images (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        alt_text TEXT,
        display_order INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS game_versions (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        version_number TEXT NOT NULL,
        release_date TEXT,
        zip_url TEXT,
        changelog TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS user (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        email_verified INTEGER NOT NULL,
        image TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS session (
        id TEXT PRIMARY KEY,
        expires_at INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
        ip_address TEXT,
        user_agent TEXT
    );

    CREATE TABLE IF NOT EXISTS account (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        provider_id TEXT NOT NULL,
        user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
        access_token TEXT,
        refresh_token TEXT,
        id_token TEXT,
        access_token_expires_at INTEGER,
        refresh_token_expires_at INTEGER,
        scope TEXT,
        password TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS verification (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER,
        updated_at INTEGER
    );
`);

console.log('Database initialized successfully!');
db.close();
