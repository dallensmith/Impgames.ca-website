import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { galleryImages, posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import JSZip from "jszip";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const images = await db.select({
            id: galleryImages.id,
            url: galleryImages.url,
            alt: galleryImages.altText,
            displayOrder: galleryImages.displayOrder,
            postId: galleryImages.postId,
            postSlug: posts.slug
        })
        .from(galleryImages)
        .leftJoin(posts, eq(galleryImages.postId, posts.id));

        const zip = new JSZip();
        
        // 1. Initial metadata XML content
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<MediaLibrary>\n';
        
        // 2. Download and add each image to the ZIP
        // We use a sequential or slightly throttled approach to avoid overwhelming the server
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            try {
                const response = await fetch(img.url);
                if (!response.ok) {
                    console.warn(`Skipping image ${img.url}: CDN returned ${response.status}`);
                    continue;
                }
                const buffer = await response.arrayBuffer();
                
                // Determine extension from original URL
                const extension = img.url.split('.').pop()?.split('?')[0] || 'webp';
                const fileName = `media_${i + 1}_${img.id}.${extension}`;
                
                zip.file(fileName, buffer);
                
                xml += `  <Image>\n`;
                xml += `    <FileName>${fileName}</FileName>\n`;
                xml += `    <PostSlug>${img.postSlug || ""}</PostSlug>\n`;
                xml += `    <AltText>${(img.alt || "").replace(/[<>&"']/g, "")}</AltText>\n`; // Basic XML escaping
                xml += `    <DisplayOrder>${img.displayOrder || 0}</DisplayOrder>\n`;
                xml += `  </Image>\n`;
            } catch (e) {
                console.error(`Error packing image ${img.url}:`, e);
            }
        }
        
        xml += '</MediaLibrary>';
        zip.file("metadata.xml", xml);

        const zipBlob = await zip.generateAsync({ 
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 }
        });

        return new NextResponse(zipBlob as any, {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="impgames_media_backup_${new Date().toISOString().split('T')[0]}.zip"`,
            },
        });
    } catch (error: any) {
        console.error("Media Export Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
