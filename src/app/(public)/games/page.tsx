import { getAllGames } from "@/lib/data";
import Cartridge from "@/components/Cartridge";
import Link from "next/link";
import { checkIsAdmin } from "@/lib/auth/auth";

export default async function GamesPage() {
    const games = await getAllGames();
    const isAdmin = await checkIsAdmin();

    return (
        <div className="wide-container">
            <div className="section-title-container">
                <h2 className="section-title">Games Archive</h2>
            </div>
            <div className="cartridge-card-grid">
                {games.map(game => (
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
                                            lineHeight: '1.5', 
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
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <span className="starburst" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
                                                v{game.version || "1.0"}
                                            </span>
                                            <span style={{ 
                                                fontFamily: 'var(--font-jersey)', 
                                                fontSize: '1rem', 
                                                color: 'rgba(255,255,255,0.4)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}>
                                                {game.releaseDate || "DATE TBD"}
                                            </span>
                                        </div>
                                        <span className="view-project-label" style={{ 
                                            fontFamily: 'var(--font-jersey)', 
                                            fontSize: '1.1rem', 
                                            color: 'var(--background)',
                                            letterSpacing: '1px'
                                        }}>
                                            DETAILS &rarr;
                                        </span>
                                    </div>
                                </div>
                        </Cartridge>
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
