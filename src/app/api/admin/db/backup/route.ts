import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const isProd = process.env.NODE_ENV === "production";
        const defaultPath = isProd ? "/data/sqlite.db" : "sqlite.db";
        const dbPath = process.env.DATABASE_URL || defaultPath;
        
        // Resolve path to absolute if it's relative
        const absolutePath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);

        if (!fs.existsSync(absolutePath)) {
            return NextResponse.json({ error: "Database file not found at " + absolutePath }, { status: 404 });
        }

        const fileBuffer = fs.readFileSync(absolutePath);
        
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/x-sqlite3",
                "Content-Disposition": `attachment; filename="impames_backup_${new Date().toISOString().split('T')[0]}.db"`,
            },
        });
    } catch (error: any) {
        console.error("Backup error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
