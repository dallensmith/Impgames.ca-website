import { db } from "@/lib/db";
import PostForm from "@/components/PostForm";
import { notFound } from "next/navigation";
import { posts, galleryImages, gameVersions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    
    const post = await db.query.posts.findFirst({
        where: eq(posts.id, id)
    });

    if (!post) notFound();

    const gallery = await db.query.galleryImages.findMany({
        where: eq(galleryImages.postId, id)
    });

    const versions = await db.query.gameVersions.findMany({
        where: eq(gameVersions.postId, id)
    });

    return (
        <div className="admin-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
             <h2 style={{ 
                marginBottom: '2rem', 
                fontSize: '2rem', 
                borderBottom: '4px solid var(--foreground)',
                paddingBottom: '0.5rem',
                display: 'inline-block'
            }}>
                Edit Game: {post.title}
            </h2>
            <div style={{ marginTop: '2rem' }}>
                <PostForm post={post} gallery={gallery} versions={versions} />
            </div>
        </div>
    );
}
