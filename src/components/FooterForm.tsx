"use client";

import { useState } from "react";
import { saveSiteSettings } from "@/lib/actions";

export default function FooterForm({ settingsMap }: { settingsMap: Record<string, string> }) {
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Parse initial links (supporting legacy comma strings and new JSON)
    const initialLinks = (() => {
        try {
            const raw = settingsMap.social_links || "[]";
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
            return [];
        } catch {
            if (!settingsMap.social_links) return [];
            return settingsMap.social_links.split(',').filter(s => s.includes(':')).map(s => {
                const [label, ...urlParts] = s.split(':');
                return {
                    platform: 'custom',
                    label: label?.trim() || 'Link',
                    url: urlParts.join(':').trim() || ''
                };
            });
        }
    })();

    const [socialLinks, setSocialLinks] = useState<any[]>(initialLinks);

    const addLink = () => {
        setSocialLinks([...socialLinks, { platform: 'custom', label: '', url: '' }]);
    };

    const removeLink = (index: number) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };

    const updateLink = (index: number, field: string, value: string) => {
        const newLinks = [...socialLinks];
        newLinks[index][field] = value;
        
        // Auto-set label if platform is chosen and label is empty
        if (field === 'platform' && !newLinks[index].label) {
            newLinks[index].label = value.charAt(0).toUpperCase() + value.slice(1);
        }
        
        setSocialLinks(newLinks);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setIsSaved(false);

        const formData = new FormData(e.currentTarget);
        // Pack social links back into JSON
        formData.set("social_links", JSON.stringify(socialLinks));
        
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
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-bowlby)', fontSize: '1.2rem', color: 'var(--primary)', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>Global Footer Messaging</h3>
                <div>
                    <label htmlFor="footer_text">Copyright & Footer Credits</label>
                    <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem', fontFamily: 'var(--font-inter)' }}>
                        The text that appears at the very bottom of every page.
                    </p>
                    <textarea 
                        id="footer_text"
                        name="footer_text" 
                        defaultValue={settingsMap.footer_text} 
                        style={{ minHeight: '100px' }} 
                        placeholder="&copy; 2026 Impgames. Built with Passion."
                    />
                </div>
            </div>

            <div className="admin-card">
                <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-bowlby)', fontSize: '1.2rem', color: 'var(--primary)', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>Social Media & External Links</h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '2rem', fontFamily: 'var(--font-inter)' }}>
                    These links will appear as badges in your footer and bio page. Use full URLs or just handles.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {socialLinks.map((link, index) => (
                        <div key={index} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 150px) minmax(120px, 150px) 1fr 50px', gap: '0.8rem', alignItems: 'end', background: '#fff', padding: '1rem', border: '3px solid #000', boxShadow: '5px 5px 0 rgba(0,0,0,0.1)' }}>
                            <div>
                                <label style={{ fontSize: '0.7rem', marginBottom: '0.3rem' }}>Platform</label>
                                <select 
                                    value={link.platform} 
                                    onChange={(e) => updateLink(index, 'platform', e.target.value)}
                                    style={{ padding: '0.4rem', fontSize: '0.85rem', border: '2px solid #000' }}
                                >
                                    <option value="twitter">Twitter / X</option>
                                    <option value="discord">Discord</option>
                                    <option value="github">GitHub</option>
                                    <option value="youtube">YouTube</option>
                                    <option value="bluesky">Bluesky</option>
                                    <option value="mastodon">Mastodon</option>
                                    <option value="itch">Itch.io</option>
                                    <option value="patreon">Patreon</option>
                                    <option value="custom">Other / Custom</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.7rem', marginBottom: '0.3rem' }}>Label</label>
                                <input 
                                    value={link.label} 
                                    onChange={(e) => updateLink(index, 'label', e.target.value)}
                                    placeholder="e.g. My GitHub"
                                    style={{ padding: '0.4rem', fontSize: '0.85rem', border: '2px solid #000' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.7rem', marginBottom: '0.3rem' }}>URL / Handle</label>
                                <input 
                                    value={link.url} 
                                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                                    placeholder="@handle or https://..."
                                    style={{ padding: '0.4rem', fontSize: '0.85rem', border: '2px solid #000' }}
                                />
                            </div>
                            <button 
                                type="button" 
                                onClick={() => removeLink(index)}
                                style={{ background: '#000', color: '#fff', padding: '0.5rem', border: 'none', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none' }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <button 
                    type="button" 
                    onClick={addLink} 
                    style={{ marginTop: '1.5rem', background: 'transparent', color: '#000', border: '3px dashed #000', width: '100%', fontSize: '0.9rem', padding: '0.8rem', boxShadow: 'none' }}
                >
                    + ADD NEW CONTACT LINK
                </button>
            </div>

            <div style={{ marginTop: '3rem' }}>
                <button 
                    type="submit" 
                    disabled={loading || isSaved} 
                    style={{ 
                        width: '100%',
                        background: isSaved ? 'var(--secondary)' : (loading ? '#999' : 'var(--primary)'),
                        color: '#fff',
                        fontSize: '1.2rem',
                        padding: '1.5rem',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    {loading ? "SAVING..." : (isSaved ? "FOOTER UPDATED!" : "SAVE FOOTER CONFIGURATION")}
                </button>
            </div>
        </form>
    );
}
