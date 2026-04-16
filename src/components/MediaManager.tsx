"use client";

import { useState } from "react";

export default function MediaManager() {
    const [exporting, setExporting] = useState(false);
    const [importing, setImporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await fetch("/api/admin/media/export");
            if (!res.ok) throw new Error("Export failed");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `media_backup_${new Date().toISOString().split('T')[0]}.zip`;
            a.click();
        } catch (err) {
            alert("Export failed. See console.");
        } finally {
            setExporting(false);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm("This will upload all images in the ZIP to BunnyCDN and re-link them to the projects in metadata.xml. Continue?")) {
            e.target.value = "";
            return;
        }

        setImporting(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/media/import", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                window.location.reload();
            } else {
                throw new Error(data.error);
            }
        } catch (err: any) {
            alert("Restore failed: " + err.message);
        } finally {
            setImporting(false);
            e.target.value = "";
        }
    };

    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
                onClick={handleExport}
                className="button" 
                style={{ fontSize: '0.8rem' }}
                disabled={exporting}
            >
                {exporting ? "PACKING ZIP..." : "↓ DOWNLOAD ALL (.ZIP)"}
            </button>

            <label 
                className="button" 
                style={{ 
                    fontSize: '0.8rem', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center',
                    opacity: importing ? 0.5 : 1,
                    pointerEvents: importing ? 'none' : 'auto'
                }}
            >
                {importing ? "RESTORING..." : "↑ RESTORE FROM ZIP"}
                <input 
                    type="file" 
                    hidden 
                    accept=".zip" 
                    onChange={handleImport}
                />
            </label>
        </div>
    );
}
