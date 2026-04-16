import { getGameBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Cartridge from "@/components/Cartridge";
import Link from "next/link";
import ScreenshotGallery from "@/components/ScreenshotGallery";

export default async function SingleGamePage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const game = await getGameBySlug(slug);

    if (!game) notFound();

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link href="/games" style={{ marginBottom: '2rem', display: 'inline-block', color: 'var(--accent)' }}>&larr; Back to Archive</Link>

            <Cartridge title={game.title} labelImage={game.coverImage || undefined}>
                <div className="cartridge-inner-content" style={{ color: '#fff' }}>
                    <div className="game-meta" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #333', padding: '1rem 0', marginBottom: '2rem' }}>
                        <div className="meta-item" style={{ fontFamily: 'var(--font-jersey)', fontSize: '1.3rem' }}>
                            <span className="starburst">
                                v{game.versions?.[0]?.versionNumber || game.version || '1.0.0'}
                            </span>
                        </div>
                        <div className="meta-item" style={{ fontFamily: 'var(--font-jersey)', fontSize: '1.3rem' }}>
                            <strong style={{ color: 'var(--background)' }}>Released:</strong> {game.releaseDate}
                        </div>
                    </div>

                    <div 
                        className="game-description" 
                        style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#fff', marginBottom: '3rem' }}
                        dangerouslySetInnerHTML={{ __html: game.content }}
                    />

                    {game.gallery.length > 0 && (
                        <ScreenshotGallery images={game.gallery} title={game.title} />
                    )}

                    {game.changelog ? (
                        <div className="game-changelog" style={{ background: '#1a1a1a', border: '1px solid #333', padding: '1.5rem', marginTop: '3rem' }}>
                            <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem', fontFamily: 'var(--font-jersey)' }}>NOTES</h3>
                            <pre style={{ color: '#fff', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{game.changelog}</pre>
                        </div>
                    ) : null}

                    {(game.versions && game.versions.length > 0) || game.zipUrl ? (
                        <div className="game-download" style={{ marginTop: '3rem', borderTop: '2px solid #333', paddingTop: '2rem' }}>
                            <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontFamily: 'var(--font-jersey)' }}>AVAILABLE DOWNLOADS</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {game.versions && game.versions.length > 0 ? (
                                    game.versions.map(v => (
                                        <div key={v.id} style={{ background: '#222', padding: '1.5rem', border: '2px solid #333' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: v.changelog ? '1rem' : '0' }}>
                                                <div>
                                                    <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-jersey)', display: 'block' }}>VERSION {v.versionNumber}</span>
                                                    {v.releaseDate && <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Released: {v.releaseDate}</span>}
                                                </div>
                                                <a href={v.zipUrl || undefined} className="button" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', margin: 0 }}>
                                                    DOWNLOAD .ZIP
                                                </a>
                                            </div>
                                            {v.changelog && (
                                                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid var(--accent)', fontSize: '0.9rem', color: '#ccc' }}>
                                                    <p style={{ fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--accent)' }}>What's New:</p>
                                                    <div style={{ whiteSpace: 'pre-wrap' }}>{v.changelog}</div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <a href={game.zipUrl || undefined} className="button" style={{ textAlign: 'center' }}>
                                        DOWNLOAD LATEST (.ZIP)
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </Cartridge>
        </div>
    );
}
