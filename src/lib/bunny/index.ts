import sharp from "sharp";

export async function uploadToBunny(
    file: Buffer,
    fileName: string,
    folder: "images" | "games" | "screenshots" = "images"
) {
    const storageZone = process.env.BUNNY_STORAGE_ZONE_NAME;
    const apiKey = process.env.BUNNY_API_KEY;
    let cdnUrl = process.env.BUNNY_CDN_URL;
    const storageEndpoint = process.env.BUNNY_STORAGE_ENDPOINT || "storage.bunnycdn.com";

    if (!storageZone || !apiKey || !cdnUrl) {
        throw new Error("BunnyCDN configuration missing");
    }

    // Ensure CDN URL has protocol
    if (!cdnUrl.startsWith("http")) {
        cdnUrl = `https://${cdnUrl}`;
    }

    let finalFile = file;
    let finalFileName = fileName;

    // Convert images to WebP but DO NOT resize (preserves original aspect ratio)
    if (folder === "images" || folder === "screenshots") {
        const sharpInstance = sharp(file).rotate(); // Auto-rotate based on EXIF

        finalFile = await sharpInstance.webp({ quality: 85 }).toBuffer();
        finalFileName = fileName.replace(/\.[^/.]+$/, "") + ".webp";
    }

    const path = `${folder}/${Date.now()}_${finalFileName}`;
    const url = `https://${storageEndpoint}/${storageZone}/${path}`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            AccessKey: apiKey,
            "Content-Type": folder === "games" ? "application/zip" : "image/webp",
        },
        body: new Uint8Array(finalFile),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`BunnyCDN upload failed: ${text}`);
    }

    return `${cdnUrl}/${path}`;
}
