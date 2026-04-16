import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login?callbackUrl=/admin");
    }

    // Check if user is allowed based on Discord ID in .env
    const superUserId = process.env.SUPER_USER_ID;
    const siteOwnerId = process.env.SITE_OWNER_ID;

    // Better Auth stores the provider's ID in the account table.
    // We fetch it to verify.
    const account = await db.query.account.findFirst({
        where: (account, { eq, and }) => and(eq(account.userId, session.user.id), eq(account.providerId, "discord"))
    });

    const isAllowed = account && (account.accountId === superUserId || account.accountId === siteOwnerId);
    
    if (!isAllowed) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--accent)' }}>ACCESS DENIED</h2>
                <p>You are not authorized to access the admin area.</p>
                <Link href="/" style={{ textDecoration: 'underline' }}>Return to Public Site</Link>
            </div>
        );
    }

    const settings = await db.query.siteSettings.findMany();
    const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Admin Panel</h1>
                <nav className="admin-nav">
                    <Link href="/admin">Dashboard</Link>
                    <Link href="/admin/posts">Games Archive</Link>
                    <Link href="/admin/media">Media Library</Link>
                    <Link href="/admin/settings">Site Settings</Link>
                    <Link href="/admin/footer">Footer Options</Link>
                </nav>
            </header>
            
            <main style={{ padding: '0 3rem 5rem 3rem', flex: 1 }}>
                {children}
            </main>


        </div>
    );
}
