import { db } from "@/lib/db";
import { galleryImages, posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function MediaLibraryPage() {
    const images = await db.select({
        id: galleryImages.id,
        url: galleryImages.url,
        alt: galleryImages.altText,
        gameTitle: posts.title,
    })
    .from(galleryImages)
    .leftJoin(posts, eq(galleryImages.postId, posts.id));

    return (
        <div className="media-library">
            <h2 style={{ 
                marginBottom: '3rem', 
                fontSize: '2rem', 
                borderBottom: '4px solid var(--foreground)',
                paddingBottom: '0.5rem',
                display: 'inline-block'
            }}>
                Media Library
            </h2>
            
            <div className="gallery-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '3rem' 
            }}>
                {images.map(img => (
                    <div key={img.id} className="admin-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'relative', aspectRatio: '4/3', border: '3px solid #000', marginBottom: '1rem', background: '#000', overflow: 'hidden' }}>
                            <img 
                                src={img.url} 
                                alt={img.alt || "Media Image"} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        </div>
                        <div style={{ flexGrow: 1 }}>
                            <p style={{ 
                                fontSize: '0.8rem', 
                                fontFamily: 'var(--font-bowlby)', 
                                textTransform: 'uppercase',
                                color: 'var(--primary)',
                                marginBottom: '0.3rem',
                                letterSpacing: '0.5px'
                            }}>
                                SOURCE GAME:
                            </p>
                            <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1.5rem', borderBottom: '2px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem' }}>
                                {img.gameTitle || "Standalone Media"}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <a href={img.url} target="_blank" className="button" style={{ width: '100%', textAlign: 'center', fontSize: '0.8rem', padding: '0.5rem' }}>
                                VIEW FULL RES
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {images.length === 0 && (
                <div style={{ textAlign: 'center', padding: '10rem 0', opacity: 0.3 }}>
                    <p style={{ fontSize: '2rem', fontFamily: 'var(--font-bowlby)' }}>NO MEDIA COLLECTED</p>
                </div>
            )}
        </div>
    );
}
