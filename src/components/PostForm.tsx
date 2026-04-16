"use client";

import { useState } from "react";
import { savePost } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function PostForm({ post, gallery, versions: initialVersions }: { post?: any, gallery?: any[], versions?: any[] }) {
    const [loading, setLoading] = useState(false);
    const [versions, setVersions] = useState<any[]>(initialVersions || []);
    const [deletedGalleryIds, setDeletedGalleryIds] = useState<string[]>([]);
    const [coverCleared, setCoverCleared] = useState(false);
    const [slug, setSlug] = useState(post?.slug || "");
    const [isSlugAuto, setIsSlugAuto] = useState(!post?.slug);
    const router = useRouter();

    const sanitizeSlug = (val: string) => {
        return val
            .toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars except dashes
            .replace(/\-\-+/g, '-');        // Replace multiple - with single -
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isSlugAuto) {
            setSlug(sanitizeSlug(e.target.value));
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSlugAuto(false);
        setSlug(sanitizeSlug(e.target.value));
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        // Ensure slug is clean of trailing dashes for the DB
        formData.set("slug", slug.replace(/^\-+/, '').replace(/\-+$/, ''));
        
        // Append version count to help the server action
        formData.append("versionCount", versions.length.toString());
        formData.append("deletedGalleryIds", JSON.stringify(deletedGalleryIds));
        if (coverCleared) {
            formData.set("existingCoverImage", "");
        }
        
        try {
            await savePost(formData);
            router.push("/admin/posts");
        } catch (error) {
            console.error(error);
            alert("Failed to save post");
        } finally {
            setLoading(false);
        }
    }

    const addVersion = () => {
        setVersions([...versions, { id: `new_${Date.now()}`, versionNumber: "", zipUrl: "" }]);
    };

    const removeVersion = (id: string) => {
        setVersions(versions.filter(v => v.id !== id));
    };

    const toggleDeleteGallery = (id: string) => {
        if (deletedGalleryIds.includes(id)) {
            setDeletedGalleryIds(deletedGalleryIds.filter(item => item !== id));
        } else {
            setDeletedGalleryIds([...deletedGalleryIds, id]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            {post?.id && <input type="hidden" name="id" value={post.id} />}
            
            <section>
                <h3 style={{ borderBottom: '2px solid var(--foreground)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-bowlby)', fontSize: '1.2rem', color: 'var(--primary)' }}>
                    Basic Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label htmlFor="title">Game Title</label>
                        <input id="title" name="title" defaultValue={post?.title} onChange={handleTitleChange} placeholder="e.g. Super Imp Man" required />
                    </div>
                    <div>
                        <label htmlFor="slug">URL Slug</label>
                        <input id="slug" name="slug" value={slug} onChange={handleSlugChange} placeholder="super-imp-man" required />
                        <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', fontFamily: 'var(--font-inter)', opacity: 0.8 }}>
                            URL Preview: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>impgames.ca/games/{slug || "..."}</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                    <label htmlFor="summary">Game Summary</label>
                    <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem', fontFamily: 'var(--font-inter)' }}>
                        Short pitch for the games grid (1-2 sentences).
                    </p>
                    <textarea id="summary" name="summary" defaultValue={post?.summary} placeholder="A brief overview of the game..." required />
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                    <label htmlFor="content">Full Description</label>
                    <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem', fontFamily: 'var(--font-inter)' }}>
                        Comprehensive details about the game, world, and mechanics.
                    </p>
                    <textarea id="content" name="content" defaultValue={post?.content} required style={{ height: '250px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                    <div>
                        <label htmlFor="releaseDate">Original Release Date</label>
                        <input id="releaseDate" name="releaseDate" type="date" defaultValue={post?.releaseDate} />
                    </div>
                    <div>
                        <label htmlFor="status">Publishing Status</label>
                        <select id="status" name="status" defaultValue={post?.status || "draft"}>
                            <option value="draft">Draft (Hidden from public)</option>
                            <option value="published">Published (Visible on site)</option>
                        </select>
                    </div>
                </div>
            </section>

            <section style={{ marginTop: '3rem' }}>
                <h3 style={{ borderBottom: '2px solid var(--foreground)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-bowlby)', fontSize: '1.2rem', color: 'var(--primary)' }}>
                    Downloads & Versions
                </h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', fontFamily: 'var(--font-inter)' }}>
                    Manage the different builds available for this game.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {versions.map((v, index) => (
                        <div key={v.id} style={{ padding: '1.5rem', border: '3px solid var(--foreground)', background: 'rgba(255,255,255,0.5)', position: 'relative' }}>
                            <button 
                                type="button" 
                                onClick={() => removeVersion(v.id)}
                                style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--primary)', color: '#fff', border: '2px solid #000', padding: '0.2rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer', boxShadow: '4px 4px 0 #000' }}
                            >
                                DELETE
                            </button>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem' }}>Version Number</label>
                                    <input name={`v_number_${index}`} defaultValue={v.versionNumber} placeholder="e.g. v1.0.3" required />
                                    <input type="hidden" name={`v_id_${index}`} value={v.id} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem' }}>Build Date</label>
                                    <input name={`v_date_${index}`} type="date" defaultValue={v.releaseDate} />
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <label style={{ fontSize: '0.8rem' }}>ROM File (.zip)</label>
                                {v.zipUrl && (
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.05)', padding: '0.5rem', border: '1px dashed #000' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{v.zipUrl.split('/').pop()}</span>
                                        <a href={v.zipUrl} download className="button" style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem' }}>Download</a>
                                        <input type="hidden" name={`v_existing_zip_${index}`} value={v.zipUrl} />
                                    </div>
                                )}
                                <input name={`v_file_${index}`} type="file" accept=".zip" />
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <label style={{ fontSize: '0.8rem' }}>Version Notes / Changelog</label>
                                <textarea name={`v_changelog_${index}`} defaultValue={v.changelog} style={{ height: '80px', fontSize: '0.9rem' }} placeholder="Bug fixes, new features..." />
                            </div>
                        </div>
                    ))}
                    
                    {versions.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center', border: '2px dashed var(--foreground)', opacity: 0.5 }}>
                            No versions added. Click below to add your first build.
                        </div>
                    )}

                    <button type="button" onClick={addVersion} style={{ background: '#000', color: '#fff', padding: '0.8rem', fontSize: '0.9rem' }}>
                        + Add Game Version
                    </button>
                </div>
            </section>

            <section style={{ marginTop: '3rem' }}>
                <h3 style={{ borderBottom: '2px solid var(--foreground)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-bowlby)', fontSize: '1.2rem', color: 'var(--primary)' }}>
                    Assets & Media
                </h3>
                
                <div className="upload-zone" style={{ border: '4px dashed var(--foreground)', padding: '2rem', background: 'rgba(255,255,255,0.3)', marginBottom: '2rem' }}>
                    <label style={{ color: 'var(--primary)' }}>Primary Cover Image (Cartridge Label)</label>
                    <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1rem', fontFamily: 'var(--font-inter)' }}>This image will be cropped to a 4:3 aspect ratio.</p>
                    
                    {post?.coverImage && !coverCleared && (
                        <div style={{ marginBottom: '1.5rem', position: 'relative', display: 'inline-block' }}>
                            <img src={post.coverImage} alt="Cover" style={{ width: '150px', border: '3px solid #000', boxShadow: '8px 8px 0 rgba(0,0,0,0.2)' }} />
                            <button 
                                type="button" 
                                onClick={() => setCoverCleared(true)}
                                style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--primary)', color: '#fff', border: '2px solid #000', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0 rgba(0,0,0,0.2)' }}
                            >
                                ×
                            </button>
                            <input type="hidden" name="existingCoverImage" value={post.coverImage} />
                        </div>
                    )}
                    {coverCleared && <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1rem' }}>⚠ Cover image will be removed.</p>}
                    <input name="coverImage" type="file" accept="image/*" style={{ border: 'none', background: 'none', padding: 0 }} />
                </div>

                <div className="upload-zone" style={{ border: '4px dashed var(--foreground)', padding: '2rem', background: 'rgba(255,255,255,0.3)' }}>
                    <label style={{ color: 'var(--primary)' }}>Screenshot Gallery</label>
                    <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem', fontFamily: 'var(--font-inter)' }}>Showcase the gameplay. New uploads will be added to the end.</p>
                    
                    {gallery && gallery.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            {gallery.map((img) => {
                                const isDeleted = deletedGalleryIds.includes(img.id);
                                return (
                                    <div key={img.id} style={{ position: 'relative', opacity: isDeleted ? 0.3 : 1, transition: 'opacity 0.2s' }}>
                                        <img src={img.url} alt="Screenshot" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', border: '3px solid #000', filter: isDeleted ? 'grayscale(100%)' : 'none' }} />
                                        <button 
                                            type="button" 
                                            onClick={() => toggleDeleteGallery(img.id)}
                                            style={{ position: 'absolute', top: '-8px', right: '-8px', background: isDeleted ? '#222' : 'var(--primary)', color: '#fff', border: '2px solid #000', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold' }}
                                        >
                                            {isDeleted ? '↺' : '×'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <input name="gallery" type="file" accept="image/*" multiple style={{ border: 'none', background: 'none', padding: 0 }} />
                </div>
            </section>

            <section style={{ marginTop: '3rem' }}>
               <label htmlFor="changelog">Admin Private Notes</label>
               <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem', fontFamily: 'var(--font-inter)' }}>Internal notes or overall project status (Not shown to public).</p>
               <textarea id="changelog" name="changelog" defaultValue={post?.changelog} style={{ height: '100px' }} placeholder="Current development stage, to-do items..." />
            </section>

            <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--foreground)', color: '#fff' }}>
                <h3 style={{ fontFamily: 'var(--font-bowlby)', marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--background)' }}>READY TO SUBMIT?</h3>
                <p style={{ marginBottom: '2rem', opacity: 0.8, fontSize: '0.9rem' }}>Ensure all version numbers and ZIP files are correct before saving. Changes will be live immediately if the status is set to "Published".</p>
                <button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: '4px solid #fff', fontSize: '1.5rem' }}>
                    {loading ? "PROCESSING..." : "SAVE GAME POST"}
                </button>
            </div>
        </form>
    );
}
