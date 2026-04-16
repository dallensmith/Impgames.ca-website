import { getAllGames } from "@/lib/data";
import Cartridge from "@/components/Cartridge";
import Link from "next/link";

export default async function GamesPage() {
    const games = await getAllGames();

    return (
        <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Games Archive</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem', alignItems: 'center' }}>
                {games.map(game => (
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
                                        <span className="starburst" style={{ fontSize: '1.0rem', padding: '6px 14px' }}>
                                            v{game.version || "1.0"}
                                        </span>
                                        <span style={{ 
                                            fontFamily: 'var(--font-jersey)', 
                                            fontSize: '1.1rem', 
                                            color: 'rgba(255,255,255,0.6)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>
                                            {game.releaseDate || "Date TBD"}
                                        </span>
                                    </div>
                                </div>
                            </Cartridge>
                        </Link>
                    </div>
                ))}
            </div>
            {games.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <p>No games in the archive yet.</p>
                </div>
            )}
        </div>
    );
}
