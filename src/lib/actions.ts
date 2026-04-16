"use server";

import { db } from "./db";
import { posts, galleryImages, siteSettings, gameVersions } from "./db/schema";
import { revalidatePath } from "next/cache";
import { uploadToBunny } from "./bunny";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

export async function savePost(formData: FormData) {
    const id = formData.get("id") as string || uuidv4();
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const summary = formData.get("summary") as string;
    const content = formData.get("content") as string;
    const releaseDate = formData.get("releaseDate") as string;
    const version = formData.get("version") as string;
    const changelog = formData.get("changelog") as string;
    const status = formData.get("status") as "draft" | "published";
    
    // Handle File Uploads
    const coverFile = formData.get("coverImage") as File;
    const zipFile = formData.get("zipFile") as File;
    
    let coverImageUrl = formData.get("existingCoverImage") as string || null;
    let zipUrl = formData.get("existingZipUrl") as string || null;

    if (coverFile && coverFile.size > 0) {
        const buffer = Buffer.from(await coverFile.arrayBuffer());
        coverImageUrl = await uploadToBunny(buffer, coverFile.name, "images");
    }

    if (zipFile && zipFile.size > 0) {
        const buffer = Buffer.from(await zipFile.arrayBuffer());
        zipUrl = await uploadToBunny(buffer, zipFile.name, "games");
    }

    const data = {
        title,
        slug,
        summary,
        content,
        coverImage: coverImageUrl,
        releaseDate,
        version,
        changelog,
        zipUrl,
        status,
        updatedAt: new Date(),
    };

    const existing = await db.query.posts.findFirst({
        where: eq(posts.id, id)
    });

    if (existing) {
        await db.update(posts).set(data).where(eq(posts.id, id));
    } else {
        await db.insert(posts).values({
            ...data,
            id,
            createdAt: new Date(),
        });
    }

    // Handle Multiple Versions
    const versionCount = parseInt(formData.get("versionCount") as string || "0");
    const currentVersionIds: string[] = [];

    for (let i = 0; i < versionCount; i++) {
        const vId = formData.get(`v_id_${i}`) as string;
        const vNumber = formData.get(`v_number_${i}`) as string;
        const vDate = formData.get(`v_date_${i}`) as string;
        const vChangelog = formData.get(`v_changelog_${i}`) as string;
        const vFile = formData.get(`v_file_${i}`) as File;
        let vZipUrl = formData.get(`v_existing_zip_${i}`) as string || "";

        if (vFile && vFile.size > 0) {
            const buffer = Buffer.from(await vFile.arrayBuffer());
            vZipUrl = await uploadToBunny(buffer, vFile.name, "games");
        }

        if (vZipUrl) {
            const finalId = vId.startsWith("new_") ? uuidv4() : vId;
            currentVersionIds.push(finalId);

            const vData = {
                id: finalId,
                postId: id,
                versionNumber: vNumber,
                zipUrl: vZipUrl,
                releaseDate: vDate,
                changelog: vChangelog,
                updatedAt: new Date(),
            };

            const vExisting = await db.query.gameVersions.findFirst({
                where: eq(gameVersions.id, finalId)
            });

            if (vExisting) {
                await db.update(gameVersions).set(vData).where(eq(gameVersions.id, finalId));
            } else {
                await db.insert(gameVersions).values({
                    ...vData,
                    createdAt: new Date(),
                });
            }
        }
    }

    // Cleanup: Delete versions that were removed in the UI
    if (existing) {
        const allVersions = await db.query.gameVersions.findMany({
            where: eq(gameVersions.postId, id)
        });
        for (const v of allVersions) {
            if (!currentVersionIds.includes(v.id)) {
                await db.delete(gameVersions).where(eq(gameVersions.id, v.id));
            }
        }
    }

    // Handle Gallery Deletions
    const deletedGalleryIdsStr = formData.get("deletedGalleryIds") as string;
    if (deletedGalleryIdsStr) {
        try {
            const deletedIds = JSON.parse(deletedGalleryIdsStr) as string[];
            for (const gId of deletedIds) {
                await db.delete(galleryImages).where(eq(galleryImages.id, gId));
            }
        } catch (e) {
            console.error("Error parsing deleted gallery IDs", e);
        }
    }

    // Handle Gallery Images (Simplified)
    const galleryFiles = formData.getAll("gallery") as File[];
    for (const file of galleryFiles) {
        if (file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const url = await uploadToBunny(buffer, file.name, "screenshots");
            await db.insert(galleryImages).values({
                id: uuidv4(),
                postId: id,
                url,
                displayOrder: 0
            });
        }
    }

    revalidatePath("/");
    revalidatePath("/games");
    revalidatePath(`/games/${slug}`);
    revalidatePath("/admin/posts");
    
    return { success: true, id };
}

export async function deletePost(id: string) {
    await db.delete(posts).where(eq(posts.id, id));
    revalidatePath("/");
    revalidatePath("/games");
    revalidatePath("/admin/posts");
    return { success: true };
}

export async function saveSiteSettings(formData: FormData) {
    const keys = Array.from(formData.keys()).filter(k => !k.startsWith("$"));
    
    for (const key of keys) {
        const val = formData.get(key);
        let value: string | null = null;

        if (val instanceof File) {
            if (val.size > 0) {
                const buffer = Buffer.from(await val.arrayBuffer());
                value = await uploadToBunny(buffer, val.name, "images");
            } else {
                continue; // Don't update if no file was uploaded
            }
        } else {
            value = val as string;
        }

        if (value !== null) {
            await db.insert(siteSettings).values({ key, value }).onConflictDoUpdate({
                target: siteSettings.key,
                set: { value }
            });
        }
    }

    revalidatePath("/");
    revalidatePath("/bio");
    return { success: true };
}
