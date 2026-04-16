import { db } from "./db";
import { siteSettings, posts, galleryImages, gameVersions } from "./db/schema";
import { eq, desc } from "drizzle-orm";

export async function getSettings() {
    const settings = await db.query.siteSettings.findMany();
    return Object.fromEntries(settings.map(s => [s.key, s.value]));
}

export async function getFeaturedGames() {
    return await db.query.posts.findMany({
        where: eq(posts.status, "published"),
        orderBy: [desc(posts.createdAt)],
        limit: 3
    });
}

export async function getAllGames() {
    return await db.query.posts.findMany({
        where: eq(posts.status, "published"),
        orderBy: [desc(posts.createdAt)]
    });
}

export async function getGameBySlug(slug: string) {
    const game = await db.query.posts.findFirst({
        where: eq(posts.slug, slug)
    });
    
    if (!game) return null;

    const gallery = await db.query.galleryImages.findMany({
        where: eq(galleryImages.postId, game.id)
    });

    const versions = await db.query.gameVersions.findMany({
        where: eq(gameVersions.postId, game.id),
        orderBy: [desc(gameVersions.createdAt)]
    });

    return { ...game, gallery, versions };
}
