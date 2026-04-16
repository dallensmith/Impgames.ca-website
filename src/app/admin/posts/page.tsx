import { db } from "@/lib/db";
import Link from "next/link";
import { posts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

import DeletePostButton from "@/components/DeletePostButton";

export default async function AdminPostsList() {
    const list = await db.query.posts.findMany({
        orderBy: [desc(posts.createdAt)]
    });

    return (
        <div className="admin-card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', borderBottom: '4px solid var(--foreground)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Games Archive</h2>
                <Link href="/admin/posts/new" className="button">
                    + ADD NEW GAME
                </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '4px solid #000' }}>
                    <thead>
                        <tr style={{ background: '#000', color: '#fff' }}>
                            <th style={{ padding: '1.2rem', textAlign: 'left', fontFamily: 'var(--font-bowlby)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Game Title</th>
                            <th style={{ padding: '1.2rem', textAlign: 'left', fontFamily: 'var(--font-bowlby)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '1.2rem', textAlign: 'left', fontFamily: 'var(--font-bowlby)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Version</th>
                            <th style={{ padding: '1.2rem', textAlign: 'right', fontFamily: 'var(--font-bowlby)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ background: 'rgba(255,255,255,0.4)' }}>
                        {list.map(post => (
                            <tr key={post.id} style={{ borderBottom: '2px solid #000' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>{post.title}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span className="status-badge" data-status={post.status} style={{ fontWeight: 'bold' }}>
                                        {post.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontFamily: 'var(--font-inter)', fontWeight: 'bold' }}>{post.version || 'v1.0.0'}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Link href={`/admin/posts/${post.id}`} style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid var(--primary)' }}>Edit</Link>
                                        <Link href={`/games/${post.slug}`} target="_blank" style={{ color: 'var(--secondary)', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid var(--secondary)' }}>View</Link>
                                        <DeletePostButton id={post.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {list.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', opacity: 0.5, fontStyle: 'italic' }}>
                                    No games found in the archive.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
