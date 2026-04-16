import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { galleryImages, posts } from "@/lib/db/schema";
import { uploadToBunny } from "@/lib/bunny";
import JSZip from "jszip";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) {
            throw new Error("No file was uploaded.");
        }

        const zipBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(zipBuffer);

        const metadataFile = zip.file("metadata.xml");
        if (!metadataFile) {
            throw new Error("Missing metadata.xml in the ZIP archive.");
        }

        const xmlContent = await metadataFile.async("string");

        // Parse XML using regex to avoid heavy XML parser dependencies
        // Extracts <Image>...</Image> blocks
        const imageBlocks = [...xmlContent.matchAll(/<Image>([\s\S]*?)<\/Image>/g)];
        
        let restoredCount = 0;
        let skipCount = 0;

        for (const block of imageBlocks) {
            const content = block[1];
            const fileName = content.match(/<FileName>(.*?)<\/FileName>/)?.[1];
            const postSlug = content.match(/<PostSlug>(.*?)<\/PostSlug>/)?.[1];
            const altText = content.match(/<AltText>(.*?)<\/AltText>/)?.[1];
            const displayOrder = parseInt(content.match(/<DisplayOrder>(.*?)<\/DisplayOrder>/)?.[1] || "0");

            if (!fileName) continue;

            const imageFile = zip.file(fileName);
            if (!imageFile) {
                skipCount++;
                continue;
            }

            try {
                // Determine target project by slug
                let targetPostId: string | null = null;
                if (postSlug) {
                    const post = await db.query.posts.findFirst({
                        where: (p, { eq }) => eq(p.slug, postSlug)
                    });
                    if (post) targetPostId = post.id;
                }

                // The database schema requires each gallery image to belong to a project (notNull)
                if (!targetPostId) {
                    console.warn(`Skipping ${fileName}: Post with slug '${postSlug}' not found in database.`);
                    skipCount++;
                    continue;
                }

                // Get file buffer
                const buffer = Buffer.from(await imageFile.async("arraybuffer"));
                
                // Upload to BunnyCDN
                const newUrl = await uploadToBunny(buffer, fileName, "screenshots");

                // Insert into database
                await db.insert(galleryImages).values({
                    id: uuidv4(),
                    postId: targetPostId,
                    url: newUrl,
                    altText: altText || null,
                    displayOrder: displayOrder
                });

                restoredCount++;
            } catch (err) {
                console.error(`Failed to restore image ${fileName}:`, err);
                skipCount++;
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Restored ${restoredCount} images successfully. ${skipCount} files were skipped or failed.` 
        });

    } catch (error: any) {
        console.error("Media Import Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
