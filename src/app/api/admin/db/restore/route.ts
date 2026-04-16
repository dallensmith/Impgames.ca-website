import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

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
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        
        const isProd = process.env.NODE_ENV === "production";
        const defaultPath = isProd ? "/data/sqlite.db" : "sqlite.db";
        const dbPath = process.env.DATABASE_URL || defaultPath;
        const absolutePath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);

        // Perform a safety backup of the current state before overwriting
        const backupPath = `${absolutePath}.pre-restore.${Date.now()}`;
        if (fs.existsSync(absolutePath)) {
            fs.copyFileSync(absolutePath, backupPath);
        }

        // Write the new database file
        fs.writeFileSync(absolutePath, buffer);

        // Clean up any transient SQLite files (WAL/SHM) to ensure the new DB opens cleanly
        const walFile = absolutePath + "-wal";
        const shmFile = absolutePath + "-shm";
        if (fs.existsSync(walFile)) fs.unlinkSync(walFile);
        if (fs.existsSync(shmFile)) fs.unlinkSync(shmFile);

        return NextResponse.json({ 
            success: true, 
            message: "Database successfully replaced. The application will use the new data on next request." 
        });
    } catch (error: any) {
        console.error("Restore error:", error);
        
        // On Windows, if the file is locked, this will fail.
        if (error.code === 'EBUSY' || error.code === 'EPERM') {
             return NextResponse.json({ 
                error: "Database file is currently in use by the server. Try again in a moment or restart the server." 
            }, { status: 500 });
        }

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
