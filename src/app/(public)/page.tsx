import { getSettings, getFeaturedGames } from "@/lib/data";
import Cartridge from "@/components/Cartridge";
import Link from "next/link";

export default async function HomePage() {
    const settings = await getSettings();
    const featuredGames = await getFeaturedGames();

    return (
        <div className="home-page">
            <section className="hero" style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
                <div style={{ margin: '0 auto', position: 'relative', display: 'inline-block' }}>
                    <img 
                        src="/frontpage.png" 
                        alt="Impgames Front Page" 
                        style={{ maxWidth: '100%', height: 'auto' }} 
                    />
                </div>

                <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.4rem', border: '4px solid var(--foreground)', padding: '1.5rem', background: 'rgba(255,255,255,0.1)' }}>
                    <p>{settings.homepage_intro || "Creating modern games for classic hardware. Explore my NES homebrew projects below."}</p>
                </div>
            </section>

            <section className="featured-games">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h3 style={{ 
                        display: 'inline-block',
                        fontSize: '1.5rem', 
                        fontFamily: 'var(--font-bowlby)', 
                        color: 'var(--primary)',
                        border: '4px solid var(--foreground)',
                        padding: '0.4rem 1.5rem',
                        background: 'var(--background)',
                        boxShadow: '6px 6px 0 var(--foreground)',
                        textTransform: 'uppercase',
                        transform: 'rotate(-0.5deg)'
                    }}>
                        Recent Releases
                    </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', alignItems: 'center' }}>
                    {featuredGames.map(game => (
                        <div key={game.id} style={{ width: '100%', maxWidth: '800px' }}>
                            <Link href={`/games/${game.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Cartridge title={game.title} labelImage={game.coverImage || undefined}>
                                    <div className="cartridge-inner-content">
                                        <div 
                                            style={{ 
                                                fontSize: '1.2rem', 
                                                lineHeight: '1.8', 
                                                color: '#eee', 
                                                marginBottom: '2rem',
                                                fontFamily: 'var(--font-inter)'
                                            }}
                                            dangerouslySetInnerHTML={{ __html: game.summary }}
                                        />
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            borderTop: '2px solid #333',
                                            paddingTop: '1.5rem'
                                        }}>
                                            <span className="starburst" style={{ fontSize: '1.1rem', padding: '8px 16px' }}>
                                                v{game.version || "1.0"}
                                            </span>
                                            <span style={{ 
                                                fontFamily: 'var(--font-jersey)', 
                                                fontSize: '1.3rem', 
                                                color: 'var(--background)',
                                                letterSpacing: '1px'
                                            }}>
                                                VIEW FULL PROJECT &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </Cartridge>
                            </Link>
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
