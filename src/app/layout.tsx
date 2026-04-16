import { Inter, Jersey_15, Bowlby_One_SC } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { getSettings } from "@/lib/data";
import { formatSocialUrl } from "@/lib/social";

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
        
        <footer className="main-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Technical Specs</h4>
              <ul className="footer-tech-list">
                <li><span className="tech-label">Framework</span> <span className="tech-value">Next.js 15 (App Router)</span></li>
                <li><span className="tech-label">Build Engine</span> <span className="tech-value">React 19 / TypeScript</span></li>
                <li><span className="tech-label">Database</span> <span className="tech-value">SQLite (libSQL Core)</span></li>
                <li><span className="tech-label">ORM Layer</span> <span className="tech-value">Drizzle v1.0</span></li>
                <li><span className="tech-label">Assets</span> <span className="tech-value">BunnyCDN Edge</span></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <div className="footer-links">
                <Link href="/">Home</Link>
                <Link href="/games">Game Archive</Link>
                <Link href="/bio">The Lab / Bio</Link>
                {session ? (
                  <Link href="/admin">Lab Control</Link>
                ) : (
                  <Link href="/login">Secure Login</Link>
                )}
              </div>
            </div>

            {settings.show_social_footer !== 'false' && settings.social_links && (() => {
              try {
                const links = JSON.parse(settings.social_links);
                if (Array.isArray(links) && links.length > 0) {
                  return (
                    <div className="footer-section">
                      <h4>Connect</h4>
                      <div className="footer-links">
                        {links.map((l: any, i: number) => (
                          <a key={i} href={formatSocialUrl(l.url, l.platform)} target="_blank" rel="noopener noreferrer">{l.label}</a>
                        ))}
                      </div>
                    </div>
                  );
                }
              } catch { return null; }
            })()}
          </div>

          <div className="footer-bottom">
            <p>{settings.footer_text || `© ${new Date().getFullYear()} Impgames. Built for the Homebrew Community.`}</p>
            <div className="footer-legal-links">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/cookies">Cookies</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
