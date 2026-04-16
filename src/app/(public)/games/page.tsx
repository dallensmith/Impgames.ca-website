import { getAllGames } from "@/lib/data";
import Cartridge from "@/components/Cartridge";
import Link from "next/link";

export default async function GamesPage() {
    const games = await getAllGames();

    return (
        <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Games Archive</h2>
            <div className="games-grid">
                {games.map(game => (
                    <Link href={`/games/${game.slug}`} key={game.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Cartridge title={game.title} labelImage={game.coverImage || undefined}>
                            <p style={{ fontSize: '0.9rem' }}>{game.summary}</p>
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8 }}>
                                <span>v{game.version || "1.0"}</span>
                                <span>{game.releaseDate || "Date TBD"}</span>
                            </div>
                        </Cartridge>
                    </Link>
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
