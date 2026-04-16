import { db } from "@/lib/db";
import Link from "next/link";
import DBMaintenance from "@/components/DBMaintenance";
import CloudflareStats from "@/components/CloudflareStats";

export default async function AdminDashboard() {
    const postsCount = (await db.query.posts.findMany()).length;
    const mediaCount = (await db.query.galleryImages.findMany()).length;

    return (
        <div>
            <h2>Dashboard Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '2rem' }}>
                <div className="admin-card centered">
                    <h3>Games</h3>
                    <p className="stat">{postsCount}</p>
                    <Link href="/admin/posts" className="button" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Manage Games</Link>
                </div>
                <div className="admin-card centered">
                    <h3>Media</h3>
                    <p className="stat">{mediaCount}</p>
                    <Link href="/admin/media" className="button" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Manage Media</Link>
                </div>
                <div className="admin-card centered">
                    <h3>Settings</h3>
                    <p className="stat">⚙</p>
                    <Link href="/admin/settings" className="button" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Edit Site Config</Link>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '3rem' }}>
                <CloudflareStats />
                <DBMaintenance />
            </div>
        </div>
    );
}
