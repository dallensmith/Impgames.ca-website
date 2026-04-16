# 🕹️ Impgames.ca - The Virtual NES Creative Lab

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![Better Auth](https://img.shields.io/badge/Better--Auth-Security-000000?style=for-the-badge)](https://better-auth.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite)](https://sqlite.org/)

**Impgames.ca** is a premium, high-fidelity portfolio and release archive designed specifically for NES homebrew developers. Built with a "hardware-first" design philosophy, the site transforms every game page into a physical NES cartridge experience, complete with high-resolution textures, responsive layouts, and a dedicated admin "Lab Control" dashboard.

---

## 🎨 Design Philosophy: The Modular Cartridge
Unlike standard portfolios, Impgames.ca utilizes a custom **Segmented Cartridge System (SCS)**. Each game page is dynamically constructed using high-quality assets:

- **Segmented Textures**: The NES cartridge is split into Top, Middle (repeatable), and Bottom segments, allowing game descriptions of any length while maintaining a perfect hardware look.
- **Retro-Premium UI**: Combines vintage paper textures, glassmorphism, and bold "Bowlby One SC" & "Jersey 15" typography for a signature high-fidelity retro feel.
- **Dynamic Case Preservations**: Explicit CSS rules ensure developer branding (e.g., specific casing like `SciNEStist`) is preserved against global uppercase transformations.

---

## 🚀 Key Features

### 🛠️ Lab Control (Admin Dashboard)
- **Unified Management**: Page-by-page control over homepage intros, developer bios, and global footer messaging.
- **Smart Media Library**: Integrated asset management with direct link copying for internal and external use.
- **Dynamic Social Hub**: A robust, platform-aware link manager (Twitter, GitHub, Discord, YouTube, BlueSky, etc.) that automatically formats handles into valid external URLs.
- **Game Versioning**: Full support for multiple release versions, changelogs, and download links per game.

### 🎮 Game Archive
- **Hardware-Accurate Display**: Features a recessed "label area" for cover art and metadata, styled to look like it's physically embedded in plastic.
- **Interactive Lightbox**: A custom React Portal-based screenshot viewer that bypasses complex 3D CSS constraints for a flawless pixel-perfect viewing experience.
- **Changelog Tracking**: Integrated markdown-ready notes section for documenting dev history.

---

## 💻 Tech Stack & Architecture

- **Frontend**: Next.js 15 (App Router) + React 19 (Server Components)
- **Styling**: Vanilla CSS (Tailored Design Tokens, Glassmorphism, CSS Variables)
- **Database**: Drizzle ORM + SQLite (libSQL for production)
- **Security**: Better Auth with Discord OAuth Provider
- **Storage**: BunnyCDN Edge Storage Integration for media and binaries
- **Server Actions**: Full standard-based mutations for all administrative tasks

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js 20+
- A Discord Developer Application (for authentication)
- A BunnyCDN Storage Zone (for image/zip hosting)

### 2. Installation
```bash
git clone https://github.com/dallensmith/Impgames.ca-website.git
cd Impgames.ca-website
npm install
```

### 3. Environment Configuration
Create a `.env` file from the provided `.env.example`:

```env
# Database
DATABASE_URL="file:./sqlite.db"

# Better Auth (Discord)
BETTER_AUTH_SECRET="your_secret_here"
BETTER_AUTH_URL="http://localhost:3000"
DISCORD_CLIENT_ID="your_discord_client_id"
DISCORD_CLIENT_SECRET="your_discord_client_secret"

# Admin Permissions
SUPER_USER_ID="your_discord_numeric_id"
SITE_OWNER_ID="another_admin_id"

# BunnyCDN Storage
BUNNY_STORAGE_API_KEY="your_api_key"
BUNNY_STORAGE_ZONE="your_zone_name"
NEXT_PUBLIC_CDN_URL="https://your-zone.b-cdn.net"
```

### 4. Database Initialization
```bash
npx drizzle-kit push
```

### 5. Running Development
```bash
npm run dev
```

---

## 📦 Deployment
The project is optimized for **Coolify** or standard **Docker** environments.

1. **Volume Mapping**: Ensure your SQLite database is mapped to a persistent volume (e.g., `/app/data/sqlite.db`) to prevent data loss on redeploy.
2. **Cron Jobs**: (Optional) Set up automated database backups via standard SQLite CLI tools.

---

## 🤝 Contributing
Built with passion for the NES Homebrew community. Feel free to fork, expand, and create your own virtual physical libraries!

---

## 📜 License
MIT License - Copyright (c) 2026 Impgames.ca
