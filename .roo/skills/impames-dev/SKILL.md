---
name: impames-dev
description: "Comprehensive development guide for the Impames.ca NES homebrew game showcase site. Use when editing any code in this project — covers Next.js 16 App Router patterns, Drizzle ORM + better-sqlite3 database operations, Server Actions, BunnyCDN file uploads, Better Auth authentication, and the cartridge-themed component system."
---

# Impames.ca Development Guide

## When to use this skill

Use this skill whenever you are editing any code in the Impames.ca project — adding pages, modifying components, changing the database schema, working with Server Actions, handling authentication, or debugging deployment issues. This is the **primary reference** for understanding how this codebase works and the conventions you must follow.

## When NOT to use this skill

- For general Next.js or React questions unrelated to this project's specific patterns — consult Next.js/React documentation directly.
- For Drizzle ORM or Better Auth API questions that are not project-specific — consult their official docs.
- For deployment/infrastructure issues outside the codebase (Docker, BunnyCDN account management) — those are ops concerns, not codebase concerns.

## Inputs required

Before editing, determine:
- **What layer are you touching?** Public page, admin page, component, database schema, Server Action, or auth?
- **Server or Client?** Public pages are Server Components (default). Admin interactive UI is Client Components (`"use client"`).
- **Read or Write?** Reads use [`src/lib/data.ts`](src/lib/data.ts); writes use [`src/lib/actions.ts`](src/lib/actions.ts).

## Quick-reference file map

| Concern | Primary file(s) |
|---------|-----------------|
| Full architecture guide | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| Project overview & setup | [`README.md`](README.md) |
| Database schema | [`src/lib/db/schema.ts`](src/lib/db/schema.ts) |
| Database connection | [`src/lib/db/index.ts`](src/lib/db/index.ts) |
| Data access (reads) | [`src/lib/data.ts`](src/lib/data.ts) |
| Server Actions (writes) | [`src/lib/actions.ts`](src/lib/actions.ts) |
| Auth configuration | [`src/lib/auth/auth.ts`](src/lib/auth/auth.ts) |
| Auth client helpers | [`src/lib/auth/client.ts`](src/lib/auth/client.ts) |
| All CSS styles | [`src/app/globals.css`](src/app/globals.css) |
| Production DB init | [`public/init-db.js`](public/init-db.js) |
| Drizzle config | [`drizzle.config.ts`](drizzle.config.ts) |

---

## 1. Project Conventions (must follow)

### Component type rules

- **Public pages** (under `src/app/(public)/`): always Server Components. No `"use client"` directive. Fetch data via `data.ts` functions.
- **Admin interactive components**: always Client Components with `"use client"` at the top. These handle form state, file uploads, WYSIWYG editing.
- **Reusable display components** (e.g., `Cartridge`): Server Components by default. Only add `"use client"` if they need hooks or event handlers.

### Styling rules

- **All styles live in [`src/app/globals.css`](src/app/globals.css)** (~835 lines). There is no CSS framework, no CSS modules, no Tailwind, no styled-components.
- Use CSS custom properties (defined in `globals.css`) for colors, fonts, and spacing.
- Use [`clsx`](https://www.npmjs.com/package/clsx) for conditional class names: `import clsx from 'clsx'`.
- When adding a new component, append its styles to `globals.css`. Group related rules under a comment header.
- The design system is hardware-first: cartridge textures, paper backgrounds, glassmorphism overlays, starburst badges. Match the existing visual language.

### Data flow rules

- **Never edit [`src/lib/data.ts`](src/lib/data.ts) or [`src/lib/actions.ts`](src/lib/actions.ts) without understanding the full data flow.** Read the relevant schema, trace callers, and check [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) first.
- All Server Actions must call `revalidatePath()` after mutations to refresh cached pages.
- Use `revalidatePath()` with specific paths (not `/`), e.g., `revalidatePath('/games/' + slug)`.

### General rules

- TypeScript strict mode throughout. All function parameters and returns must be typed.
- Use `next/link` for internal navigation, never bare `<a>` tags.
- Use `next/image` for static images; for BunnyCDN-hosted images use standard `<img>` tags (they're external URLs).
- When unsure about patterns, read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) first.

---

## 2. Database Operations

### Schema

The database schema is defined in [`src/lib/db/schema.ts`](src/lib/db/schema.ts). There are **8 tables**:

| Table | Purpose |
|-------|---------|
| `users` | Better Auth user records |
| `sessions` | Better Auth session tokens |
| `accounts` | Better Auth OAuth account links |
| `verifications` | Better Auth email verification tokens |
| `posts` | Game entries (slug, title, description, cover image, screenshots, versions) |
| `galleryImages` | Media manager gallery |
| `siteSettings` | Key-value site configuration (homepage intro, developer name, bio, etc.) |
| `gameVersions` | Version history per game post |

### Connection

[`src/lib/db/index.ts`](src/lib/db/index.ts) initializes the Drizzle client with better-sqlite3:
- **Production**: database file at `/data/sqlite.db` (Docker volume mount)
- **Development**: database file at `sqlite.db` (project root)

### Query patterns

```typescript
// Relational queries (preferred for joins)
import { db } from '@/lib/db';
const result = await db.query.posts.findMany({ with: { gameVersions: true } });

// Insert
await db.insert(posts).values({ slug: 'my-game', title: 'My Game', ... });

// Update
await db.update(posts).set({ title: 'New Title' }).where(eq(posts.slug, 'my-game'));

// Delete
await db.delete(posts).where(eq(posts.slug, 'my-game'));
```

### Data access functions ([`src/lib/data.ts`](src/lib/data.ts))

Key read functions available:
- `getSettings()` — all site settings as key-value pairs
- `getFeaturedGames()` — featured posts for homepage
- `getAllGames()` — all published posts for the games index
- `getGameBySlug(slug)` — single post with versions
- `getGalleryImages()` — all gallery images

### Schema changes — CRITICAL DUAL-UPDATE RULE

When you add or modify a database column:

1. **Update [`src/lib/db/schema.ts`](src/lib/db/schema.ts)** — add the column to the Drizzle table definition.
2. **Run `npx drizzle-kit push`** — this applies the change to the local dev database immediately.
3. **Update [`public/init-db.js`](public/init-db.js)** — this is the raw SQL script that initializes the production database. Add the corresponding `ALTER TABLE` or column to the `CREATE TABLE` statement.
4. **Update any affected queries in [`data.ts`](src/lib/data.ts) and actions in [`actions.ts`](src/lib/actions.ts).**

⚠️ **Skipping step 3 causes production failures.** The dev DB uses Drizzle Kit migrations; the production DB uses `init-db.js` raw SQL. These can diverge if you're not careful.

---

## 3. Authentication & Authorization

### Auth stack

- **Better Auth** v1.6.4 with **Discord OAuth** as the sole social provider.
- Configuration in [`src/lib/auth/auth.ts`](src/lib/auth/auth.ts).
- Client helpers in [`src/lib/auth/client.ts`](src/lib/auth/client.ts).

### Session behavior

- Sessions expire after **30 days**.
- Better Auth handles cookie management automatically — do not manually set auth cookies.
- Session is available server-side via `auth.api.getSession({ headers })`.

### Admin protection

- **Layout guard**: [`src/app/admin/layout.tsx`](src/app/admin/layout.tsx) wraps all `/admin/*` routes. It checks the session and verifies the user's Discord ID against the configured admin IDs.
- **Server-side guard**: use `checkIsAdmin()` from [`auth.ts`](src/lib/auth/auth.ts) to protect individual Server Actions or API routes.
- **Admin Discord IDs** are configured via environment variables:
  - `SUPER_USER_ID` — primary admin
  - `SITE_OWNER_ID` — secondary admin
- Both IDs are checked; either grants access.

### Adding a new admin-protected route

Place the page under `src/app/admin/` — the `AdminLayout` in `layout.tsx` already protects all routes in that directory via the route group. No additional auth checks needed in individual admin pages.

---

## 4. Server Actions ([`src/lib/actions.ts`](src/lib/actions.ts))

All data mutations are Server Actions using the `"use server"` directive. The file is server-only; it should never be imported into a Client Component directly (use `startTransition` + `useActionState` patterns in client code).

### Standard mutation pattern

```
1. Receive FormData from client
2. Validate required fields (return early with error if missing)
3. Perform database operation (insert/update/delete)
4. If file uploads are involved: process with sharp → upload to BunnyCDN → get CDN URL
5. Store resulting URLs in the database
6. Call revalidatePath() to refresh affected pages
7. Return success/error result
```

### Key actions

| Action | Purpose |
|--------|---------|
| `savePost(formData)` | Create or update a game post (handles title→slug generation, cover image, screenshots, versions) |
| `deletePost(slug)` | Delete a game post and its associated images |
| `saveSiteSettings(formData)` | Update homepage intro, developer name, bio, profile image |
| `saveFooterSettings(formData)` | Update social links and footer content |
| `uploadToBunny(file, folder)` | Upload a single file to BunnyCDN, return CDN URL |

### File upload pattern (inside a Server Action)

```typescript
const file = formData.get('image') as File;
if (file && file.size > 0) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const processed = await sharp(buffer)
    .rotate()                    // auto-orient based on EXIF
    .webp({ quality: 85 })      // convert to WebP
    .toBuffer();
  // Upload to BunnyCDN Storage API
  await fetch(`https://storage.bunnycdn.com/${zone}/${folder}/${fileName}`, {
    method: 'PUT',
    headers: { AccessKey: apiKey, 'Content-Type': 'image/webp' },
    body: processed,
  });
  // Construct CDN URL
  const url = `https://${zone}.b-cdn.net/${folder}/${fileName}`;
}
```

---

## 5. Component Patterns

### Cartridge ([`src/components/Cartridge.tsx`](src/components/Cartridge.tsx)) — Server Component

The signature visual component of the site. Renders a NES cartridge with:
- **Top segment**: non-repeating texture image
- **Middle segment**: vertically repeating texture (accommodates arbitrary content height)
- **Bottom segment**: non-repeating texture image
- **Label area**: overlaid on the middle segment
- **Recessed content zone**: where child content renders (indented, with inner shadow)

Use `<Cartridge>{children}</Cartridge>` to wrap game detail content. Do not modify the texture segmentation logic unless you understand how the three background images compose.

### ScreenshotGallery ([`src/components/ScreenshotGallery.tsx`](src/components/ScreenshotGallery.tsx)) — Client Component

Grid of thumbnails + React Portal lightbox. Supports:
- Click to open full-size image in lightbox overlay
- Keyboard navigation: Escape to close, Left/Right arrows to navigate
- Renders via `createPortal` to `document.body`

### PostForm ([`src/components/PostForm.tsx`](src/components/PostForm.tsx)) — Client Component

Full game CRUD form. Key behaviors:
- **Title → slug auto-generation**: typing in the title field auto-generates a URL-safe slug (live preview shown below)
- Embeds `WysiwygEditor` for rich text content
- Cover image upload with preview
- Screenshot upload with gallery preview
- Version management sub-form (add/remove version entries)
- Calls `savePost` Server Action on submit

### WysiwygEditor ([`src/components/WysiwygEditor.tsx`](src/components/WysiwygEditor.tsx)) — Client Component

Rich text editor with toolbar:
- Bold, italic, underline
- Text alignment (left, center, right, justify)
- Ordered/unordered lists
- Link insertion
- **Inline image upload**: images dropped/pasted into the editor are uploaded to BunnyCDN and inserted as `<img>` tags with the CDN URL

### SettingsForm ([`src/components/SettingsForm.tsx`](src/components/SettingsForm.tsx)) — Client Component

Site settings editor for:
- Homepage intro text
- Developer name, bio
- Profile image upload (with preview)
- Calls `saveSiteSettings` Server Action

### FooterForm ([`src/components/FooterForm.tsx`](src/components/FooterForm.tsx)) — Client Component

Social links editor supporting 9 platforms:
- Platform-aware URL formatting (e.g., auto-detects `@username` vs full URL for Twitter/X)
- Handles: Twitter/X, GitHub, Discord, YouTube, Instagram, Facebook, LinkedIn, Twitch, TikTok
- Calls `saveFooterSettings` Server Action

### MediaManager ([`src/components/MediaManager.tsx`](src/components/MediaManager.tsx)) — Client Component

Export/import all gallery images as a ZIP file:
- **Export**: packages all BunnyCDN-hosted gallery images into a downloadable ZIP
- **Import**: accepts a ZIP upload, extracts images, and re-uploads them to BunnyCDN

### DBMaintenance ([`src/components/DBMaintenance.tsx`](src/components/DBMaintenance.tsx)) — Client Component

Database backup and restore:
- **Download backup**: streams the SQLite file for download
- **Restore**: accepts an uploaded SQLite file and replaces the current database (requires confirmation)
- ⚠️ Always backup before restore — restore is destructive

### CloudflareStats ([`src/components/CloudflareStats.tsx`](src/components/CloudflareStats.tsx)) — Client Component

Live analytics dashboard (optional — degrades gracefully if credentials are not configured).

### DeletePostButton ([`src/components/DeletePostButton.tsx`](src/components/DeletePostButton.tsx)) — Client Component

Isolated delete button with confirmation dialog. Calls `deletePost` Server Action.

---

## 6. File Upload Flow (BunnyCDN)

BunnyCDN Edge Storage is the **sole file store** — there is no local file upload storage. Every uploaded image goes through this pipeline:

1. **Client**: file selected via `<input type="file">` in a form
2. **Server Action**: receives `FormData`, extracts the `File` object
3. **Buffer conversion**: `Buffer.from(await file.arrayBuffer())`
4. **Image processing**: `sharp(buffer).rotate().webp({ quality: 85 }).toBuffer()`
   - Auto-rotates based on EXIF orientation
   - Converts to WebP at quality 85
   - Original filename preserved but extension changed to `.webp`
5. **Upload**: `PUT` request to `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${folder}/${fileName}` with `AccessKey` header
6. **URL construction**: `https://${BUNNY_STORAGE_ZONE}.b-cdn.net/${folder}/${fileName}`
7. **Database**: CDN URL stored in the relevant table

Environment variables required:
- `BUNNY_STORAGE_ZONE` — storage zone name
- `BUNNY_API_KEY` — storage zone access key (not the account API key)
- `BUNNY_PULL_ZONE` — CDN pull zone hostname (optional, for custom domains)

---

## 7. Common Development Workflows

### Adding a new public page

1. Create file in `src/app/(public)/your-page/`
2. Make it a **Server Component** (no `"use client"`)
3. Import data functions from [`src/lib/data.ts`](src/lib/data.ts)
4. Use `Cartridge` component for game-related content
5. Add any new styles to [`src/app/globals.css`](src/app/globals.css)
6. Link to the page from relevant navigation

### Adding a new admin page

1. Create file in `src/app/admin/your-page/`
2. If it has interactive elements, add `"use client"` directive
3. Admin layout protection is automatic (handled by route group in [`admin/layout.tsx`](src/app/admin/layout.tsx))
4. Add a navigation link in the admin sidebar (in [`admin/layout.tsx`](src/app/admin/layout.tsx))
5. For mutations, call Server Actions from [`src/lib/actions.ts`](src/lib/actions.ts)

### Adding a database column

1. Add column to the Drizzle table definition in [`src/lib/db/schema.ts`](src/lib/db/schema.ts)
2. Run `npx drizzle-kit push` to update the dev database
3. **Update [`public/init-db.js`](public/init-db.js)** — add the column to the `CREATE TABLE` statement or add an `ALTER TABLE`
4. Update any relevant queries in [`data.ts`](src/lib/data.ts)
5. Update any relevant actions in [`actions.ts`](src/lib/actions.ts)

### Adding a new Server Action

1. Add the function to [`src/lib/actions.ts`](src/lib/actions.ts) — the file already has `"use server"` at the top
2. Follow the standard mutation pattern (validate → db op → optional upload → revalidatePath)
3. Call `revalidatePath()` with the specific path(s) affected
4. Return a plain object (not a class instance) — Server Actions serialize return values

### Adding a new reusable component

1. Create file in `src/components/YourComponent.tsx`
2. Determine: **Server** (no `"use client"`) or **Client** (`"use client"` at top)?
3. If it needs hooks (`useState`, `useEffect`, `useRef`), event handlers, or browser APIs → Client Component
4. Add styles to [`src/app/globals.css`](src/app/globals.css) under a commented section header
5. Use `clsx` for conditional class composition

---

## 8. Critical Warnings

| # | Warning |
|---|---------|
| 1 | **Schema changes require dual update**: modifying [`schema.ts`](src/lib/db/schema.ts) without updating [`init-db.js`](public/init-db.js) **will break production**. These are two separate initialization paths. |
| 2 | **No CSS frameworks or modules**: all styles go in [`globals.css`](src/app/globals.css). Do not add Tailwind, CSS modules, styled-components, or any other CSS solution. |
| 3 | **BunnyCDN is the sole file store**: there is no local upload directory. All uploaded files go to BunnyCDN Edge Storage. Do not write files to `public/` or any local directory for user-generated content. |
| 4 | **SQLite is synchronous and file-based**: better-sqlite3 runs in-process. Long write locks can cause `EBUSY` errors on Windows. Back up the database before any restore operation. |
| 5 | **The footer in [`layout.tsx`](src/app/layout.tsx) has misleading text**: it references "Next.js 15" and "libSQL" — neither is accurate. Next.js 16 and better-sqlite3 are actually used. Update this text if you touch the footer. |
| 6 | **Server Components cannot use hooks, `useState`, `useEffect`, `useRef`, event handlers, or browser APIs** (`window`, `document`, `localStorage`). If you need any of these, the component must be a Client Component. |
| 7 | **Server Actions serialize return values**: return plain objects, not class instances, Dates, or functions. Use `revalidatePath()` for cache invalidation — do not rely on client-side cache busting. |
| 8 | **Drizzle Kit vs init-db.js divergence**: there is no automated migration for production. Drizzle Kit is for dev only. The `init-db.js` file is manually maintained. Always check both after schema changes. |

---

## 9. Troubleshooting

### "EBUSY" or database lock errors (Windows dev)

SQLite uses file-level locking. Close any other processes accessing `sqlite.db` (including Drizzle Studio). Restart the dev server.

### Changes not appearing after mutation

Ensure the Server Action calls `revalidatePath()` with the correct path. Check that the path is specific (e.g., `/games/my-game`) rather than just `/`.

### BunnyCDN upload failures

Verify:
- `BUNNY_STORAGE_ZONE` and `BUNNY_API_KEY` env vars are set
- The API key is a **storage zone access key** (not the account-level API key)
- The storage zone has write access enabled
- The file size is under BunnyCDN limits

### Auth / login not working

Verify:
- `BETTER_AUTH_SECRET` is set
- `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` are set
- Discord OAuth redirect URI matches `https://your-domain.com/api/auth/callback/discord`
- `SUPER_USER_ID` or `SITE_OWNER_ID` matches your Discord user ID

### TypeScript errors after schema change

Run `npx drizzle-kit generate` to regenerate type definitions, then restart the TypeScript server in your editor.
