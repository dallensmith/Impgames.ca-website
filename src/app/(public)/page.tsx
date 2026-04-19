import { getSettings, getFeaturedGames } from "@/lib/data";
import Cartridge from "@/components/Cartridge";
import Link from "next/link";
import { checkIsAdmin } from "@/lib/auth/auth";

export default async function HomePage() {
    const settings = await getSettings();
    const featuredGames = await getFeaturedGames();
    const isAdmin = await checkIsAdmin();

    return (
        <div className="home-page wide-container">
            <section className="hero" style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
                <div style={{ margin: '0 auto', position: 'relative', display: 'inline-block' }}>
                    <img 
                        src="/frontpage.png" 
                        alt="Impgames Front Page" 
                        style={{ maxWidth: '100%', height: 'auto' }} 
                    />
                </div>

                <div className="hero-intro">
                    <p className="hero-intro-text">{settings.homepage_intro || "Creating modern games for classic hardware. Explore my NES homebrew projects below."}</p>
                </div>
            </section>

            <section className="featured-games">
                <div className="section-title-container">
                    <h3 className="section-title">
                        Recent Releases
                    </h3>
                </div>
                <div className="cartridge-card-grid">
                    {featuredGames.map(game => (
                        <div key={game.id} className="cartridge-card-mode">
                            <Cartridge 
                                title={game.title} 
                                labelImage={game.coverImage || undefined}
                                href={`/games/${game.slug}`}
                                titleExtra={
                                    isAdmin ? (
                                        <Link 
                                            href={`/admin/posts/${game.id}`} 
                                            style={{ 
                                                background: 'var(--accent)', 
                                                color: '#fff', 
                                                padding: '0.2rem 0.6rem', 
                                                fontSize: '0.7rem', 
                                                textDecoration: 'none', 
                                                fontFamily: 'var(--font-inter)',
                                                border: '2px solid #000',
                                                borderRadius: '4px',
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Edit
                                        </Link>
                                    ) : null
                                }
                            >
                                <div className="cartridge-inner-content">
                                        <div 
                                            className="game-summary"
                                            style={{ 
                                                lineHeight: '1.6', 
                                                color: '#eee', 
                                                fontFamily: 'var(--font-inter)'
                                            }}
                                            dangerouslySetInnerHTML={{ __html: game.summary }}
                                        />
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            borderTop: '2px solid #333',
                                            paddingTop: '1rem'
                                        }}>
                                            <span className="starburst" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
                                                v{game.version || "1.0"}
                                            </span>
                                            <span className="view-project-label" style={{ 
                                                fontFamily: 'var(--font-jersey)', 
                                                fontSize: '1.1rem', 
                                                color: 'var(--background)',
                                                letterSpacing: '1px'
                                            }}>
                                                VIEW &rarr;
                                            </span>
                                        </div>
                                    </div>
                            </Cartridge>
                        </div>
                    ))}
                </div>
                {featuredGames.length === 0 && (
                    <p style={{ textAlign: 'center', opacity: 0.5 }}>No games released yet. Stay tuned!</p>
                )}
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Link href="/games" className="button" style={{ 
                        display: 'inline-block', 
                        padding: '1.2rem 3rem', 
                        background: 'var(--primary)', 
                        color: '#fff', 
                        textDecoration: 'none',
                        fontFamily: 'var(--font-bowlby)',
                        fontSize: '1.1rem',
                        border: '6px solid #000',
                        boxShadow: '8px 8px 0 rgba(0,0,0,0.15)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        View All Games
                    </Link>
                </div>
            </section>
        </div>
    );
}
