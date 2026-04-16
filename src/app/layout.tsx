import { Inter, Jersey_15, Bowlby_One_SC } from "next/font/google";
import "./globals.css";
import Link from "next/link";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import type { Metadata } from "next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jersey = Jersey_15({
  weight: "400",
  variable: "--font-jersey",
  subsets: ["latin"],
});

const bowlby = Bowlby_One_SC({
    weight: "400",
    variable: "--font-bowlby",
    subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Impgames.ca | Custom NES Games",
  description: "Portfolio and release archive for NES homebrew games.",
};

import { getSettings } from "@/lib/data";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const settings = await getSettings();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${jersey.variable} ${bowlby.variable}`}>
        <header>
          <h1>Impgames</h1>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/games">Games</Link>
            <Link href="/bio">Bio</Link>
            {session && <Link href="/admin">Admin</Link>}
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {settings.social_links && (() => {
              try {
                const links = JSON.parse(settings.social_links);
                if (Array.isArray(links)) {
                  return links.map((l, i) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.7 }}>{l.label}</a>
                  ));
                }
              } catch { return null; }
            })()}
          </div>
          <p>{settings.footer_text || `© ${new Date().getFullYear()} Impgames. Built with Next.js & SQLite.`}</p>
        </footer>
      </body>
    </html>
  );
}
