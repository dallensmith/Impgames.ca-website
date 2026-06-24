# 🏗️ Impames.ca — Architecture & Development Guide

## Table of Contents

1. [Project Overview](#project-overview)
2. [Design Philosophy](#design-philosophy)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Database](#database)
6. [Authentication](#authentication)
7. [Component Architecture](#component-architecture)
8. [Data Flow](#data-flow)
9. [Admin System](#admin-system)
10. [Deployment](#deployment)
11. [Development Patterns](#development-patterns)
12. [Caveats & Gotchas](#caveats--gotchas)

---

## Project Overview

**Impgames.ca** is a premium portfolio and release archive for NES homebrew games. It presents each game as a physical NES cartridge experience — a "virtual physical library" built with a hardware-first aesthetic. The site serves as both a public showcase and a full-featured admin dashboard ("Lab Control") for managing posts, media, site settings, and database backups.

- **Repository**: `dallensmith/Impgames.ca-website`
- **License**: MIT (Copyright © 2026 Impgames.ca)
- **Target Audience**: NES homebrew developers and their communities

---

## Design Philosophy

### Hardware-First Aesthetic

Every design decision starts from physical media. The cartridge is not a metaphor — it is structurally modeled in CSS using real high-resolution textures segmented into top, middle (repeatable), and bottom pieces. This allows game descriptions of any length while maintaining a perfect hardware silhouette.

### Server-First Architecture

The project embraces Next.js App Router's server-first model:

- All data fetching happens in Server Components via the [`data.ts`](src/lib/data.ts:1) layer
- Mutations are handled exclusively through Server Actions in [`actions.ts`](src/lib/actions.ts:1)
- Client Components are only used where interactivity is required (lightbox, WYSIWYG, forms)

### Physical Media Nostalgia

Typography (Bowlby One SC, Jersey 15), paper textures, glassmorphism, starburst badges, and explicit CSS rules that preserve developer casing preferences (e.g., `SciNEStist` against global `text-transform: uppercase`) all serve the goal of evoking the feel of holding a physical cartridge.

---

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Framework** | Next.js (App Router) | 16.2.3 | Standalone output mode for Docker |
| **UI Library** | React | 19.2.4 | Server Components as default |
| **Language** | TypeScript | ^5 | Strict mode via ESLint config |
| **Database** | SQLite via better-sqlite3 | ^12.9.0 | Synchronous, in-process; no daemon |
| **ORM** | Drizzle ORM | ^0.45.2 | Schema defined in [`schema.ts`](src/lib/db/schema.ts:1) |
| **Auth** | Better Auth | ^1.6.4 | Discord OAuth social provider |
| **Image Processing** | sharp | ^0.34.5 | WebP conversion on upload |
| **CDN Storage** | BunnyCDN Edge Storage | — | PUT-based uploads via REST API |
| **Styling** | Vanilla CSS | — | Custom properties in [`globals.css`](src/app/globals.css:1) (~835 lines) |
| **Icons** | Lucide React | ^1.8.0 | Toolbar buttons in WYSIWYG |
| **ZIP Handling** | JSZip | ^3.10.1 | Media import/export |
| **Validation** | Zod | ^4.3.6 | Runtime type validation |
| **UUIDs** | uuid | ^13.0.0 | ID generation for all entities |
| **Dev Tooling** | Drizzle Kit | ^0.31.10 | Schema push for local dev |
| **Linting** | ESLint 9 | — | next/core-web-vitals + typescript |

---

## Project Structure

```
impames/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout (header, footer, session, settings)
│   │   ├── globals.css               # Single CSS file (~835 lines, CSS custom properties)
│   │   ├── (public)/                 # Route group — public-facing pages
│   │   │   ├── page.tsx              # Homepage (featured games, hero)
│   │   │   ├── games/page.tsx        # Full game archive listing
│   │   │   ├── games/[slug]/page.tsx # Single game detail (cartridge + gallery + downloads)
│   │   │   └── bio/page.tsx          # Developer bio page
│   │   ├── admin/                    # Admin dashboard (auth-protected)
│   │   │   ├── layout.tsx            # AdminLayout — auth guard + nav
│   │   │   ├── page.tsx              # Dashboard overview (counts, DBMaintenance, CloudflareStats)
│   │   │   ├── posts/page.tsx        # Post list
│   │   │   ├── posts/new/page.tsx    # Create new post (PostForm)
│   │   │   ├── posts/[id]/page.tsx   # Edit existing post (PostForm)
│   │   │   ├── media/page.tsx        # Media library (MediaManager)
│   │   │   ├── settings/page.tsx     # Site settings (SettingsForm)
│   │   │   └── footer/page.tsx       # Footer/social links editor (FooterForm)
│   │   ├── api/
│   │   │   ├── auth/[...better-auth]/route.ts  # Better Auth handler
│   │   │   └── admin/                # Admin API routes
│   │   │       ├── db/backup/route.ts           # GET — download SQLite backup
│   │   │       ├── db/restore/route.ts          # POST — restore from uploaded .db
│   │   │       ├── media/upload/route.ts        # POST — WYSIWYG inline image upload
│   │   │       ├── media/export/route.ts        # GET — export all media as ZIP
│   │   │       ├── media/import/route.ts        # POST — import media from ZIP
│   │   │       └── stats/cloudflare/route.ts    # GET — Cloudflare analytics proxy
│   │   ├── login/page.tsx            # Login page
│   │   ├── privacy/page.tsx          # Privacy policy
│   │   ├── terms/page.tsx            # Terms of service
│   │   └── cookies/page.tsx          # Cookie policy
│   ├── components/                   # React components
│   │   ├── Cartridge.tsx             # Server Component — NES cartridge visual wrapper
│   │   ├── ScreenshotGallery.tsx     # Client Component — lightbox with keyboard nav
│   │   ├── PostForm.tsx              # Client Component — game create/edit form
│   │   ├── SettingsForm.tsx          # Client Component — site settings form
│   │   ├── FooterForm.tsx            # Client Component — footer/social links editor
│   │   ├── WysiwygEditor.tsx         # Client Component — rich text editor with BunnyCDN upload
│   │   ├── MediaManager.tsx          # Client Component — media library management
│   │   ├── DBMaintenance.tsx         # Client Component — backup/restore UI
│   │   ├── CloudflareStats.tsx       # Client Component — analytics display
│   │   └── DeletePostButton.tsx      # Client Component — post deletion with confirmation
│   └── lib/                          # Shared library code
│       ├── db/
│       │   ├── index.ts             # Drizzle ORM init + better-sqlite3 connection
│       │   └── schema.ts            # Table definitions (8 tables)
│       ├── auth/
│       │   ├── auth.ts              # Better Auth config + checkIsAdmin()
│       │   └── client.ts            # Client-side auth client
│       ├── data.ts                   # Server-side data access functions
│       ├── actions.ts                # Server Actions (savePost, deletePost, saveSiteSettings)
│       ├── bunny/index.ts            # BunnyCDN upload utility (sharp WebP conversion)
│       └── social.ts                 # Social URL formatter (platform → URL mapping)
├── public/                           # Static assets
│   ├── init-db.js                    # Production DB initialization (raw SQL)
│   └── *.png                         # Cartridge texture segments, icons, avatars
├── data/                             # Docker volume mount target for SQLite DB
│   └── .gitkeep
├── drizzle.config.ts                 # Drizzle Kit configuration
├── next.config.ts                    # Next.js config (standalone output, 50MB body limit)
├── Dockerfile                        # Multi-stage Docker build (node:20-alpine)
├── docker-entrypoint.sh              # Container entrypoint (init-db → server)
├── .env.example                      # Environment variable template
├── package.json                      # Dependencies and scripts
└── README.md                         # Project README

scratch/                              # Scratch/temp files (ignored)
.roo/                                 # Roo extension config
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| [`src/app/(public)/`](src/app/(public)/) | Public-facing route group (homepage, games, bio) |
| [`src/app/admin/`](src/app/admin/) | Admin dashboard — all pages protected by [`AdminLayout`](src/app/admin/layout.tsx:1) auth guard |
| [`src/app/api/`](src/app/api/) | API routes — Better Auth handler + admin utilities |
| [`src/lib/`](src/lib/) | Shared library — DB, auth, data access, actions, BunnyCDN, social utils |
| [`src/components/`](src/components/) | React components — mix of Server and Client Components |
| [`public/`](public/) | Static assets — cartridge textures, icons, production DB init script |
| [`data/`](data/) | Docker volume mount point for SQLite database persistence |

---

## Database

### Engine

**better-sqlite3** — a synchronous, in-process SQLite3 driver for Node.js. No separate database server process is required. The database is a single file ([`sqlite.db`](sqlite.db)) stored at the project root in development and at `/data/sqlite.db` in production (Docker volume mount).

### Tables (8 total)

Defined in [`src/lib/db/schema.ts`](src/lib/db/schema.ts:1):

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `user` | Better Auth users | `id`, `name`, `email`, `role`, `discord_id` |
| `session` | Better Auth sessions | `id`, `token`, `expires_at`, `user_id` → `user.id` |
| `account` | OAuth account links | `account_id` (Discord ID), `provider_id`, `user_id` → `user.id` |
| `verification` | Email verification tokens | `identifier`, `value`, `expires_at` |
| `posts` | Game posts (the core content) | `id`, `title`, `slug` (unique), `content`, `cover_image`, `zip_url`, `status`, `is_featured` |
| `gallery_images` | Screenshots per game | `post_id` → `posts.id` (CASCADE), `url`, `display_order` |
| `game_versions` | Versioned downloads per game | `post_id` → `posts.id` (CASCADE), `version_number`, `zip_url`, `changelog` |
| `site_settings` | Key-value site config | `key` (PK), `value` |

### Dual Initialization System

The project uses **two different** database initialization paths, which is important to understand:

#### 1. Drizzle Kit (Development)

```bash
npx drizzle-kit push
```

- Reads the Drizzle schema from [`src/lib/db/schema.ts`](src/lib/db/schema.ts:1)
- Uses [`drizzle.config.ts`](drizzle.config.ts:1) for connection config
- Pushes schema changes directly to the SQLite database
- **Only used during local development**

#### 2. `init-db.js` (Production)

```bash
node public/init-db.js
```

- Located at [`public/init-db.js`](public/init-db.js:1)
- Contains **raw SQL** `CREATE TABLE IF NOT EXISTS` statements
- Includes `ALTER TABLE` migration logic via `addColumnIfMissing()` helper
- Runs automatically at container startup via [`docker-entrypoint.sh`](docker-entrypoint.sh:10)
- **This is the production path** — the Docker container never runs `drizzle-kit push`

> ⚠️ **Schema Divergence Risk**: Because the Drizzle schema and `init-db.js` raw SQL are maintained separately, they can diverge. When adding a new column or table, both files must be updated.

### No Formal Migrations

The project does not use Drizzle's `generate`/`migrate` workflow with migration files. Instead:

- Table creation uses `CREATE TABLE IF NOT EXISTS` (idempotent)
- Column additions use [`ALTER TABLE ADD COLUMN`](public/init-db.js:105) with existence checks via `PRAGMA table_info()`
- This is a simple but fragile approach — it cannot handle column renames, type changes, or constraint modifications

### Database Module

[`src/lib/db/index.ts`](src/lib/db/index.ts:1) initializes the Drizzle ORM with better-sqlite3:

```typescript
// Production → /data/sqlite.db (Docker volume)
// Development → sqlite.db (project root)
// Fallback → :memory: (in-memory, data lost on restart)
const sqlite = new Database(process.env.DATABASE_URL || defaultPath);
export const db = drizzle(sqlite, { schema });
```

The `DATABASE_URL` environment variable can override the path. In production, this is typically `file:/data/sqlite.db`.

### Data Access Layer

[`src/lib/data.ts`](src/lib/data.ts:1) provides server-side query functions used by Server Components:

| Function | Purpose | Used By |
|----------|---------|---------|
| [`getSettings()`](src/lib/data.ts:5) | Returns all site settings as `Record<string, string>` | Root layout, homepage |
| [`getFeaturedGames()`](src/lib/data.ts:15) | Latest 2 published posts | Homepage |
| [`getAllGames()`](src/lib/data.ts:23) | All published posts, newest first | Games archive page |
| [`getGameBySlug(slug)`](src/lib/data.ts:30) | Single game with gallery + versions joined | Single game page |

These functions **gracefully handle missing tables** by catching errors and returning empty/default values, which allows the site to render even before the database is fully initialized.

---

## Authentication

### Better Auth Configuration

Defined in [`src/lib/auth/auth.ts`](src/lib/auth/auth.ts:1):

- **Provider**: Discord OAuth only (no email/password, no other social providers)
- **Adapter**: `drizzleAdapter` from `better-auth/adapters/drizzle` with SQLite provider
- **Session Duration**: 30 days expiry, 1-day update interval
- **Cookie Cache**: 5-minute cache enabled

### API Route

[`src/app/api/auth/[...better-auth]/route.ts`](src/app/api/auth/[...better-auth]/route.ts:1) exports standard GET/POST handlers via `toNextJsHandler(auth)`. All Better Auth endpoints (`/api/auth/*`) are handled through this catch-all route.

### Client-Side Auth

[`src/lib/auth/client.ts`](src/lib/auth/client.ts:1) creates a client-side auth client using `createAuthClient` from `better-auth/react`. This provides hooks for sign-in, sign-out, and session state in Client Components.

The base URL is configured via the `NEXT_PUBLIC_BETTER_AUTH_URL` environment variable, defaulting to `http://localhost:3000`.

### Admin Authorization

Two mechanisms protect admin routes:

#### 1. `checkIsAdmin()` Utility ([`auth.ts`](src/lib/auth/auth.ts:34))

```typescript
export async function checkIsAdmin() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return false;
    
    const account = await db.query.account.findFirst({
        where: (acc, { eq, and }) => and(
            eq(acc.userId, session.user.id),
            eq(acc.providerId, "discord")
        )
    });
    
    return account && (
        account.accountId === process.env.SUPER_USER_ID ||
        account.accountId === process.env.SITE_OWNER_ID
    );
}
```

- Compares the user's Discord account ID against `SUPER_USER_ID` and `SITE_OWNER_ID` environment variables
- Used in public pages to conditionally show "Edit" links to admins

#### 2. `AdminLayout` Auth Guard ([`src/app/admin/layout.tsx`](src/app/admin/layout.tsx:1))

- Runs the same Discord ID check inline
- Redirects unauthenticated users to `/login?callbackUrl=/admin`
- Shows "ACCESS DENIED" page for authenticated but unauthorized users
- All routes under `/admin/*` inherit this protection automatically

---

## Component Architecture

### Component Directory

| Component | Type | File | Purpose |
|-----------|------|------|---------|
| **Cartridge** | Server | [`Cartridge.tsx`](src/components/Cartridge.tsx:1) | NES cartridge visual wrapper with segmented textures, recessed label area, and optional link wrapping |
| **ScreenshotGallery** | Client | [`ScreenshotGallery.tsx`](src/components/ScreenshotGallery.tsx:1) | Thumbnail grid + React Portal lightbox with keyboard navigation (← → Escape) |
| **PostForm** | Client | [`PostForm.tsx`](src/components/PostForm.tsx:1) | Game create/edit form — title, slug, status, cover image, version management, gallery, changelog |
| **WysiwygEditor** | Client | [`WysiwygEditor.tsx`](src/components/WysiwygEditor.tsx:1) | `contentEditable` rich text editor with toolbar (bold/italic/underline, alignment, lists, links, images), inline BunnyCDN image upload, and image resize by drag |
| **SettingsForm** | Client | [`SettingsForm.tsx`](src/components/SettingsForm.tsx:1) | Site-wide settings form (homepage intro, bio text, social links, etc.) |
| **FooterForm** | Client | [`FooterForm.tsx`](src/components/FooterForm.tsx:1) | Footer content and social links editor |
| **MediaManager** | Client | [`MediaManager.tsx`](src/components/MediaManager.tsx:1) | Media library browser with URL copying, upload, ZIP export/import |
| **DBMaintenance** | Client | [`DBMaintenance.tsx`](src/components/DBMaintenance.tsx:1) | Backup download + restore upload UI |
| **CloudflareStats** | Client | [`CloudflareStats.tsx`](src/components/CloudflareStats.tsx:1) | Cloudflare analytics display (optional) |
| **DeletePostButton** | Client | [`DeletePostButton.tsx`](src/components/DeletePostButton.tsx:1) | Post deletion trigger with confirmation |

### Cartridge Component (Key Visual Component)

The [`Cartridge`](src/components/Cartridge.tsx:1) component is the signature visual element of the site. It renders a three-segment NES cartridge:

1. **Top segment** — background image from `--cart-top-img` CSS variable ([`cartbgtop-2048x259.png`](public/cartbgtop-2048x259.png))
2. **Middle segment** — repeats vertically via `--cart-middle-img` CSS variable, allowing any content height
3. **Bottom segment** — background image from `--cart-bottom-img` CSS variable ([`cartbgbottom-2048x657.png`](public/cartbgbottom-2048x657.png))

Inside the cartridge body is a "recessed area" containing:
- A **label area** (cover image or placeholder text)
- A **content area** for children (descriptions, metadata, download links)

The component optionally wraps the entire cartridge in a `<Link>` for card-style navigation on listing pages, and supports a `titleExtra` prop for admin Edit buttons.

---

## Data Flow

### Read Path (Public Pages)

```
Browser Request
    ↓
Server Component (e.g., HomePage, GamesPage, SingleGamePage)
    ↓
[`data.ts`](src/lib/data.ts:1) functions (getSettings, getFeaturedGames, etc.)
    ↓
Drizzle ORM query (db.query.posts.findMany, etc.)
    ↓
better-sqlite3 synchronous read
    ↓
SQLite database file (sqlite.db)
    ↓
Rendered HTML → Browser
```

All public pages are **Server Components**. They import functions from [`data.ts`](src/lib/data.ts:1) and call them directly during render. No API routes are involved in reads. The response is fully server-rendered HTML.

### Write Path (Admin Mutations)

```
Client Component (PostForm, SettingsForm, etc.)
    ↓
FormData constructed from form fields + file inputs
    ↓
Server Action call (e.g., savePost(formData))
    ↓
[`actions.ts`](src/lib/actions.ts:1) — "use server" functions
    ↓
├── File Upload: Buffer → sharp (WebP conversion) → BunnyCDN PUT
├── Database: Drizzle ORM insert/update/delete
└── Cache Revalidation: revalidatePath() for affected routes
    ↓
Browser sees updated data on next navigation/refresh
```

All mutations go through Server Actions — no REST or GraphQL API for data writes.

### File Upload Flow

```
Client: <input type="file"> → FormData
    ↓
Server Action: formData.get("file") → File object
    ↓
Buffer.from(await file.arrayBuffer())
    ↓
[`bunny/index.ts`](src/lib/bunny/index.ts:3): uploadToBunny(buffer, fileName, folder)
    ↓
├── Images ("images", "screenshots"): sharp → rotate (EXIF) → webp(quality: 85)
├── Games ("games"): pass-through as-is (ZIP files)
    ↓
PUT https://storage.bunnycdn.com/{storageZone}/{folder}/{timestamp}_{filename}
    Headers: AccessKey: {apiKey}, Content-Type: image/webp or application/zip
    ↓
Return: {cdnUrl}/{folder}/{timestamp}_{filename}
    ↓
Stored in database (cover_image, zip_url, gallery_images.url, etc.)
```

Key details:
- **Images are ALWAYS converted to WebP** with 85% quality — original formats (PNG, JPG) are discarded
- **Original aspect ratio is preserved** — no resizing/cropping occurs
- **ZIP files pass through unchanged**
- **Filenames are prefixed with `Date.now()`** to prevent collisions
- **BunnyCDN is the sole file store** — there is no local file storage for uploads

---

## Admin System

### Dashboard ([`admin/page.tsx`](src/app/admin/page.tsx:1))

Displays:
- Game count and media count (queried directly from DB)
- Quick links to Games, Media, Settings sections
- [`CloudflareStats`](src/components/CloudflareStats.tsx:1) component (optional — fetches from `/api/admin/stats/cloudflare`)
- [`DBMaintenance`](src/components/DBMaintenance.tsx:1) component (backup/restore)

### Post CRUD

| Route | Purpose |
|-------|---------|
| `/admin/posts` | List all posts (draft + published) |
| `/admin/posts/new` | Create new game post |
| `/admin/posts/[id]` | Edit existing game post |

The [`PostForm`](src/components/PostForm.tsx:1) component handles both create and edit flows. It's a single form that covers:
- Basic info (title, slug with auto-generation, summary, full description, release date, status)
- Version management (add/remove versions with individual ZIP uploads and changelogs)
- Assets (cover image with clear ability, screenshot gallery with delete toggling)
- Admin notes (private changelog)

### Media Library ([`admin/media/page.tsx`](src/app/admin/media/page.tsx:1))

The [`MediaManager`](src/components/MediaManager.tsx:1) component provides:
- Browse all uploaded images with URL copying
- Upload new images via `/api/admin/media/upload`
- Export all media as ZIP via `/api/admin/media/export`
- Import media from ZIP via `/api/admin/media/import`

### Site Settings ([`admin/settings/page.tsx`](src/app/admin/settings/page.tsx:1))

The [`SettingsForm`](src/components/SettingsForm.tsx:1) manages key-value pairs in the `site_settings` table:
- Homepage intro text
- Bio page content
- Social links (JSON array of `{label, url, platform}` objects)
- Footer text
- Any other site-wide configuration

### Footer Editor ([`admin/footer/page.tsx`](src/app/admin/footer/page.tsx:1))

The [`FooterForm`](src/components/FooterForm.tsx:1) component specifically manages:
- Footer text/messaging
- Social link entries (platform-aware URL formatting)
- Show/hide social footer toggle

### Database Backup & Restore

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/db/backup` | GET | Downloads the current `sqlite.db` as a file attachment |
| `/api/admin/db/restore` | POST | Accepts an uploaded `.db` file, creates a `.pre-restore.{timestamp}` safety backup, then overwrites the active database |

**Restore safety**: Before overwriting, the current database is copied to `sqlite.db.pre-restore.{timestamp}`. WAL/SHM files are cleaned up after restore. On Windows, if the database is locked by the running server, restore will fail with an `EBUSY` error.

### Cloudflare Analytics (Optional)

The [`CloudflareStats`](src/components/CloudflareStats.tsx:1) component fetches from `/api/admin/stats/cloudflare`, which proxies requests to the Cloudflare GraphQL Analytics API. Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ZONE_ID` environment variables. This feature is entirely optional — if the env vars are not set, the component gracefully handles the absence.

---

## Deployment

### Docker Architecture

The project uses a **multi-stage Docker build** defined in [`Dockerfile`](Dockerfile:1):

| Stage | Base Image | Purpose |
|-------|-----------|---------|
| `deps` | `node:20-alpine` | Install production dependencies (`npm ci`) |
| `builder` | `node:20-alpine` | Build Next.js (`npm run build`) |
| `runner` | `node:20-alpine` | Production runtime — minimal image |

**Production image contents:**
- `/app/public/` — static assets
- `/app/.next/standalone/` — Next.js standalone output (includes server + node_modules)
- `/app/.next/static/` — build-time static files
- `/app/init-db.js` — database initialization script
- [`/app/docker-entrypoint.sh`](docker-entrypoint.sh:1) — container entrypoint

### Security

- **Non-root user**: The container runs as `nextjs` (UID 1001) in the `nodejs` group (GID 1001)
- **Telemetry disabled**: `NEXT_TELEMETRY_DISABLED=1` in both build and runtime
- **`su-exec`**: Used to run `init-db.js` and `server.js` as the non-root user

### Volume Mount

The SQLite database must be persisted outside the container:

```
/data  →  /app/data/sqlite.db (or custom DATABASE_URL path)
```

The [`docker-entrypoint.sh`](docker-entrypoint.sh:1) script:
1. `chown -R nextjs:nodejs /data` — ensures the non-root user can write
2. `node init-db.js` — creates/migrates tables
3. `node server.js` — starts the Next.js production server

### Standalone Output Mode

Configured in [`next.config.ts`](next.config.ts:4):

```typescript
output: 'standalone'
```

This produces a self-contained build in `.next/standalone/` that includes all necessary `node_modules` and the built server. The Docker runner stage copies only this directory (not `node_modules` from deps), keeping the image minimal.

### Required Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `BETTER_AUTH_SECRET` | **Yes** | Encryption key for auth tokens |
| `BETTER_AUTH_URL` | **Yes** | Public URL of the site (for OAuth callbacks) |
| `DISCORD_CLIENT_ID` | **Yes** | Discord OAuth application ID |
| `DISCORD_CLIENT_SECRET` | **Yes** | Discord OAuth application secret |
| `SUPER_USER_ID` | **Yes** | Discord user ID for primary admin |
| `SITE_OWNER_ID` | **Yes** | Discord user ID for secondary admin |
| `BUNNY_STORAGE_ZONE_NAME` | **Yes** | BunnyCDN storage zone name |
| `BUNNY_API_KEY` | **Yes** | BunnyCDN API key (AccessKey) |
| `BUNNY_CDN_URL` | **Yes** | Public CDN URL (e.g., `https://myzone.b-cdn.net`) |
| `DATABASE_URL` | No | SQLite file path (defaults to `/data/sqlite.db` in prod) |
| `CLOUDFLARE_API_TOKEN` | No | Cloudflare API token for analytics |
| `CLOUDFLARE_ZONE_ID` | No | Cloudflare zone ID for analytics |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | No | Client-side auth URL (defaults to `http://localhost:3000`) |
| `BUNNY_STORAGE_ENDPOINT` | No | Storage endpoint (defaults to `storage.bunnycdn.com`) |

### Server Actions Body Size

[`next.config.ts`](next.config.ts:5) configures a 50MB body size limit for Server Actions:

```typescript
experimental: {
    serverActions: {
        bodySizeLimit: '50mb',
    },
}
```

This is necessary for game ZIP file uploads through the [`PostForm`](src/components/PostForm.tsx:1).

---

## Development Patterns

### How to Add a New Public Page

1. Create a new directory under [`src/app/(public)/`](src/app/(public)/):

   ```
   src/app/(public)/new-page/
   └── page.tsx
   ```

2. Write a Server Component that imports from [`data.ts`](src/lib/data.ts:1) or queries the database directly:

   ```tsx
   // src/app/(public)/new-page/page.tsx
   import { getSettings } from "@/lib/data";
   
   export default async function NewPage() {
       const settings = await getSettings();
       return <div>{settings.some_value}</div>;
   }
   ```

3. Add navigation links in [`layout.tsx`](src/app/layout.tsx:1) (header nav and/or footer).

### How to Add a New Admin Page

1. Create a new directory under [`src/app/admin/`](src/app/admin/):

   ```
   src/app/admin/new-tool/
   └── page.tsx
   ```

2. The page is **automatically protected** by [`AdminLayout`](src/app/admin/layout.tsx:1) — no additional auth code needed.

3. Add a navigation link in [`admin/layout.tsx`](src/app/admin/layout.tsx:46) inside the `<nav className="admin-nav">`.

### How to Add a New Database Table

1. **Add the Drizzle schema** in [`src/lib/db/schema.ts`](src/lib/db/schema.ts:1):

   ```typescript
   export const newTable = sqliteTable("new_table", {
       id: text("id").primaryKey(),
       name: text("name").notNull(),
       createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
   });
   ```

2. **Add the raw SQL** in [`public/init-db.js`](public/init-db.js:1):

   ```javascript
   db.exec(`
       CREATE TABLE IF NOT EXISTS new_table (
           id TEXT PRIMARY KEY,
           name TEXT NOT NULL,
           created_at INTEGER DEFAULT (strftime('%s', 'now'))
       );
   `);
   ```

3. **Update the schema export** — ensure the new table is exported from `schema.ts` and included in the Drizzle `schema` object in [`db/index.ts`](src/lib/db/index.ts:15).

4. **Add data access functions** in [`data.ts`](src/lib/data.ts:1) if public reading is needed.

5. **Add server actions** in [`actions.ts`](src/lib/actions.ts:1) if mutation is needed.

### How to Add a New Server Action

1. Add a new `"use server"` function in [`src/lib/actions.ts`](src/lib/actions.ts:1):

   ```typescript
   "use server";
   
   export async function myNewAction(formData: FormData) {
       // 1. Extract data from formData
       // 2. Handle file uploads via uploadToBunny()
       // 3. Perform database operations via db.insert/update/delete
       // 4. Call revalidatePath() for affected routes
       return { success: true };
   }
   ```

2. Import and call from a Client Component:

   ```tsx
   import { myNewAction } from "@/lib/actions";
   // ...
   await myNewAction(formData);
   ```

### How File Uploads Work

1. Client collects files via `<input type="file">` in a `<form>`
2. Files become part of `FormData` automatically
3. Server Action receives `FormData`, extracts files via `formData.get("fieldName") as File`
4. File is converted to `Buffer` via `Buffer.from(await file.arrayBuffer())`
5. Buffer is passed to [`uploadToBunny()`](src/lib/bunny/index.ts:3) with the target folder
6. [`uploadToBunny()`](src/lib/bunny/index.ts:3) converts images to WebP via sharp, then PUTs to BunnyCDN
7. The returned CDN URL is stored in the database
8. `revalidatePath()` ensures the new content appears on the next page load

### How Auth Guards Work

**Admin Layout** ([`admin/layout.tsx`](src/app/admin/layout.tsx:1)):
- Fetches the session on every request via `auth.api.getSession()`
- If no session → redirects to `/login`
- If session exists → queries the `account` table for the Discord provider entry
- Compares `account.accountId` against `SUPER_USER_ID` and `SITE_OWNER_ID` env vars
- If match → renders children (admin page)
- If no match → renders "ACCESS DENIED" page

**Inline Admin Check** (used in public pages):
- Import `checkIsAdmin()` from [`auth.ts`](src/lib/auth/auth.ts:34)
- Call in Server Component — returns boolean
- Use to conditionally render Edit links, admin controls, etc.

---

## Caveats & Gotchas

### Version Mismatch in Hardcoded Text

- The `<footer>` in [`layout.tsx`](src/app/layout.tsx:62) hardcodes "Next.js 15 (App Router)" and "SQLite (libSQL Core)" and "Drizzle v1.0" — these are **not dynamically generated** and may be outdated. The actual versions are Next.js 16.2.3, better-sqlite3 (not libSQL), and Drizzle ORM ~0.45.2.

### Dual Database Initialization (Fragile)

- [`schema.ts`](src/lib/db/schema.ts:1) (Drizzle) and [`init-db.js`](public/init-db.js:1) (raw SQL) must be **kept in sync manually**. Adding a column to the Drizzle schema without updating `init-db.js` will cause production failures because the Docker container never runs `drizzle-kit push`.

### No Formal Drizzle Migrations

- No migration files in a `drizzle/` directory. The project relies on `CREATE TABLE IF NOT EXISTS` + `ALTER TABLE ADD COLUMN` with existence checks. This works for additive changes but **cannot handle**:
  - Column renames
  - Column type changes
  - Constraint modifications
  - Index creation
  - Data migrations

### Single Large CSS File

- All styles are in a single `globals.css` file (~835 lines). There are no CSS modules, no component-scoped styles, and no CSS framework. Styles are organized by section comments within the file. This keeps things simple but may become unwieldy as the project grows.

### Better SQLite3 Synchronous I/O

- better-sqlite3 is **synchronous and blocking**. While this simplifies the code (no async/await for DB queries), it means a slow query blocks the entire Node.js event loop. For a low-traffic portfolio site this is acceptable, but it would not scale to high concurrency without worker threads.

### Direct Filesystem Access for Backups

- The backup route ([`backup/route.ts`](src/app/api/admin/db/backup/route.ts:1)) reads the SQLite file directly via `fs.readFileSync()`. On Windows, this can fail with `EBUSY` if the database is locked by another operation. On Linux (production Docker), SQLite file locking is generally more cooperative. The restore route uses `fs.writeFileSync()` which has the same limitation.

### BunnyCDN as Sole File Store

- All uploaded files go directly to BunnyCDN. There is **no local fallback storage**. If BunnyCDN is unreachable, file uploads will fail entirely. Already-uploaded files will 404 if the CDN is down (though CDN caching typically mitigates this).

### No Admin User Management UI

- Admin users are determined solely by Discord IDs hardcoded in environment variables (`SUPER_USER_ID`, `SITE_OWNER_ID`). There is no UI to add/remove admins — it requires a redeploy to change.

### Environment Variable Naming Inconsistency

- The `.env.example` file uses `BUNNY_STORAGE_ZONE_NAME` and `BUNNY_API_KEY`, while the README setup section uses `BUNNY_STORAGE_API_KEY` and `BUNNY_STORAGE_ZONE`. The actual code uses `BUNNY_STORAGE_ZONE_NAME`, `BUNNY_API_KEY`, and `BUNNY_CDN_URL` as defined in [`bunny/index.ts`](src/lib/bunny/index.ts:8-10). Always refer to the `.env.example` or the source code for actual variable names.

### UUID v4 for All IDs

- The project uses `uuid` v4 for all primary keys (posts, gallery images, game versions). These are generated client-side in forms or server-side in actions. Database auto-increment integers are not used for any content tables.

### `dangerouslySetInnerHTML` Usage

- Game content (summary, description) is rendered using `dangerouslySetInnerHTML` because it contains HTML from the WYSIWYG editor. This content is authored by trusted admins only and is never user-submitted, but it's worth noting as a potential XSS vector if the admin role is compromised.

### Next.js 16 Considerations

- Next.js 16.2.3 has breaking changes from 15.x. The App Router, Server Components, and Server Actions APIs are stable at this version. Refer to the local Next.js documentation at `node_modules/next/dist/docs/` for the most accurate API reference, as online documentation may reference different versions.

### SQLite WAL Mode

- better-sqlite3 uses WAL (Write-Ahead Logging) mode by default, which creates `-wal` and `-shm` companion files alongside the main `.db` file. The restore route explicitly cleans these up after replacing the database to prevent corruption.

---

## Quick Reference

### Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run init-db` | Run production DB initialization |
| `npx drizzle-kit push` | Push Drizzle schema to dev database |
| `npx drizzle-kit studio` | Open Drizzle Studio (DB browser) |

### Port Reference

| Service | Port |
|---------|------|
| Next.js dev server | 3000 |
| Next.js production | 3000 (configurable via `PORT` env) |
| Drizzle Studio | 4983 |

### File Paths Reference

| Path | Purpose |
|------|---------|
| `sqlite.db` | Development database (project root) |
| `/data/sqlite.db` | Production database (Docker volume) |
| `.env` | Environment variables (git-ignored) |
| `.env.example` | Environment variable template (committed) |
