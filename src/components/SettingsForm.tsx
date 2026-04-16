"use client";

import { useState } from "react";
import { saveSiteSettings } from "@/lib/actions";

export default function SettingsForm({ settingsMap }: { settingsMap: Record<string, string> }) {
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setIsSaved(false);

        const formData = new FormData(e.currentTarget);
        
        try {
            const result = await saveSiteSettings(formData);
            if (result.success) {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred while saving.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div>
                <label htmlFor="homepage_intro">Homepage Intro Text</label>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem', fontFamily: 'var(--font-inter)' }}>
                    Short pitch appearing on the home page hero section.
                </p>
                <textarea 
                    id="homepage_intro"
                    name="homepage_intro" 
                    defaultValue={settingsMap.homepage_intro} 
                    style={{ minHeight: '120px' }} 
                    placeholder="Welcome to Impgames..."
                />
            </div>

            <div>
                <label htmlFor="developer_name">Developer Name</label>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem', fontFamily: 'var(--font-inter)' }}>
                    Your full name or alias as you want it to appear on the site.
                </p>
                <input 
                    id="developer_name"
                    name="developer_name" 
                    defaultValue={settingsMap.developer_name} 
                    placeholder="e.g. Retro Game Developer"
                />
            </div>

            <div>
                <label htmlFor="bio_content">Bio Page Content</label>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem', fontFamily: 'var(--font-inter)' }}>
                    Detailed developer biography and history.
                </p>
                <textarea 
                    id="bio_content"
                    name="bio_content" 
                    defaultValue={settingsMap.bio_content} 
                    style={{ minHeight: '250px' }} 
                    placeholder="I started developing NES games in..."
                />
            </div>

            <div className="upload-zone" style={{ border: '4px dashed var(--foreground)', padding: '2rem', background: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem' }}>
                <label htmlFor="bio_image">Bio Profile Image</label>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1rem', fontFamily: 'var(--font-inter)' }}>
                    Upload your personal photo for the bio page.
                </p>
                
                {settingsMap.bio_image && (
                    <div style={{ marginBottom: '1.5rem', position: 'relative', display: 'inline-block' }}>
                        <img src={settingsMap.bio_image} alt="Current Bio" style={{ width: '150px', border: '3px solid #000', borderRadius: '50%', aspectRatio: '1', objectFit: 'cover', boxShadow: '8px 8px 0 rgba(0,0,0,0.2)' }} />
                        <p style={{ fontSize: '0.7rem', textAlign: 'center', marginTop: '0.5rem', fontWeight: 'bold' }}>CURRENT PHOTO</p>
                    </div>
                )}
                
                <input 
                    id="bio_image"
                    name="bio_image" 
                    type="file"
                    accept="image/*"
                    style={{ border: 'none', background: 'none', padding: 0 }}
                />
            </div>

            <div style={{ marginTop: '2rem' }}>
                <button 
                    type="submit" 
                    disabled={loading || isSaved} 
                    style={{ 
                        width: '100%',
                        background: isSaved ? 'var(--secondary)' : (loading ? '#999' : 'var(--primary)'),
                        color: '#fff',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    {loading ? "SAVING..." : (isSaved ? "SAVED SUCCESSFULLY!" : "SAVE SITE SETTINGS")}
                </button>
            </div>
        </form>
    );
}
