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
                <h3 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Recent Releases</h3>
                <div className="games-grid">
                    {featuredGames.map(game => (
                        <Link href={`/games/${game.slug}`} key={game.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Cartridge title={game.title} labelImage={game.coverImage || undefined}>
                                <p style={{ fontSize: '0.9rem' }}>{game.summary}</p>
                                <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                                    Version {game.version || "1.0"}
                                </div>
                            </Cartridge>
                        </Link>
                    ))}
                </div>
                {featuredGames.length === 0 && (
                    <p style={{ textAlign: 'center', opacity: 0.5 }}>No games released yet. Stay tuned!</p>
                )}
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link href="/games" className="button" style={{ display: 'inline-block', padding: '1rem 2rem', background: '#000', color: '#fff', textDecoration: 'none' }}>
                        View All Games
                    </Link>
                </div>
            </section>
        </div>
    );
}
