"use client";

import { useState } from "react";

export default function DBMaintenance() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleBackup = () => {
        window.location.href = "/api/admin/db/backup";
    };

    const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileName = file.name;
        if (!confirm(`Are you sure you want to restore "${fileName}"?\n\nThis will completely OVERWRITE the current site database. All current posts, settings, and users will be replaced. This cannot be undone.`)) {
            e.target.value = "";
            return;
        }

        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/db/restore", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                // Force a page reload after a short delay so user sees success message
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: "Upload failed: " + err.message });
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    };

    return (
        <div className="admin-card">
            <h3 style={{ 
                borderBottom: '2px solid var(--foreground)', 
                paddingBottom: '0.5rem', 
                marginBottom: '1.5rem', 
                fontFamily: 'var(--font-bowlby)', 
                color: 'var(--primary)',
                fontSize: '1.2rem'
            }}>
                DATABASE MAINTENANCE
            </h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.8, fontFamily: 'var(--font-inter)' }}>
                Download a full backup of the SQLite database or restore from a previous file. 
                <br/><strong>Note:</strong> Restore will replace the entire site state.
            </p>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button 
                    onClick={handleBackup} 
                    className="button" 
                    style={{ background: '#000', color: '#fff', border: 'none', padding: '0.8rem 1.5rem' }}
                >
                    ⬇ DOWNLOAD SQLITE.DB
                </button>

                <div style={{ position: 'relative' }}>
                    <label 
                        className="button" 
                        style={{ 
                            background: 'var(--primary)', 
                            color: '#fff', 
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.5 : 1,
                            padding: '0.8rem 1.5rem',
                            display: 'inline-block'
                        }}
                    >
                        {loading ? "RESTORING..." : "⬆ RESTORE FROM FILE"}
                        <input 
                            type="file" 
                            accept=".db" 
                            onChange={handleRestore} 
                            disabled={loading}
                            style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }} 
                        />
                    </label>
                </div>
            </div>

            {message && (
                <div style={{ 
                    marginTop: '1.5rem', 
                    padding: '1rem', 
                    borderLeft: `5px solid ${message.type === 'success' ? '#2ecc71' : '#e74c3c'}`,
                    background: message.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                    color: message.type === 'success' ? '#1b5e20' : '#b71c1c',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 'bold'
                }}>
                    {message.type === 'success' ? '✓ ' : '⚠ '}{message.text}
                </div>
            )}
        </div>
    );
}
