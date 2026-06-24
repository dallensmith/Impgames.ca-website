import { db } from "./db";
import { siteSettings, posts, galleryImages, gameVersions } from "./db/schema";
import { eq, desc } from "drizzle-orm";

export async function getSettings() {
    try {
        const settings = await db.query.siteSettings.findMany();
        return Object.fromEntries(settings.map(s => [s.key, s.value]));
    } catch (e) {
        console.warn("Notice: Using default settings (tables may not exist yet).");
        return {};
    }
}

export async function getFeaturedGames() {
    // 1. Fetch posts manually selected for showcase (showcaseOrder 1 or 2)
    const showcaseSelections = await db.query.posts.findMany({
        where: (fields, { isNotNull }) => isNotNull(fields.showcaseOrder),
        orderBy: (fields, { asc }) => [asc(fields.showcaseOrder)],
    });

    // 2. If 2 showcase posts selected, return them
    if (showcaseSelections.length >= 2) {
        return showcaseSelections.slice(0, 2);
    }

    const selectedIds = showcaseSelections.map(p => p.id);

    // 3. If 1 showcase post selected, supplement with most recent published post
    if (showcaseSelections.length === 1) {
        const recentPosts = await db.query.posts.findMany({
            where: (fields, { eq, and, notInArray }) =>
                and(eq(fields.status, "published"), notInArray(fields.id, selectedIds)),
            orderBy: (fields, { desc }) => [desc(fields.createdAt)],
            limit: 1,
        });
        return [...showcaseSelections, ...recentPosts];
    }

    // 4. If 0 showcase posts selected, return 2 most recent published (existing behaviour)
    return await db.query.posts.findMany({
        where: (fields, { eq }) => eq(fields.status, "published"),
        orderBy: (fields, { desc }) => [desc(fields.createdAt)],
        limit: 2,
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
