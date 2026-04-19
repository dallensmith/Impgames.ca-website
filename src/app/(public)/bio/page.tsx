import { getSettings } from "@/lib/data";
import { formatSocialUrl } from "@/lib/social";

export default async function BioPage() {
    const settings = await getSettings();

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ padding: '3rem', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(10px)', border: '6px solid var(--foreground)', boxShadow: '15px 15px 0 rgba(0,0,0,0.2)', position: 'relative' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    
                    <div style={{ position: 'relative' }}>
                        {settings.bio_image ? (
                            <img 
                                src={settings.bio_image} 
                                alt={settings.developer_name || "Creator"} 
                                style={{ width: '220px', height: '220px', borderRadius: '50%', border: '6px solid var(--foreground)', objectFit: 'cover', boxShadow: '10px 10px 0 var(--primary)' }} 
                            />
                        ) : (
                            <div style={{ width: '220px', height: '220px', borderRadius: '50%', border: '6px solid var(--foreground)', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', fontFamily: 'var(--font-bowlby)' }}>
                                {settings.developer_name?.charAt(0) || "?"}
                            </div>
                        )}
                        <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: '#fff', padding: '0.5rem 1.5rem', fontFamily: 'var(--font-jersey)', fontSize: '1.2rem', clipPath: 'polygon(100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%, 0% 0%)' }}>
                            CREATOR
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h2 style={{ 
                            fontSize: '4rem', 
                            color: 'var(--primary)', 
                            marginBottom: '0.5rem', 
                            fontFamily: 'var(--font-inter)', 
                            fontWeight: '900',
                            letterSpacing: '-2px',
                            textShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                            textTransform: 'none'
                        }}>
                            {settings.developer_name || "The Developer"}
                        </h2>
                        <div style={{ height: '6px', width: '80px', background: 'var(--foreground)', margin: '0 auto 1.5rem auto' }}></div>
                        
                        <div style={{ textAlign: 'left', position: 'relative', maxWidth: '650px', margin: '0 auto' }}>
                            <div 
                                style={{ fontSize: '1.25rem', lineHeight: '1.9', color: 'var(--foreground)', opacity: 0.9 }}
                                dangerouslySetInnerHTML={{ __html: settings.bio_content || "This creator is still writing their legend..." }}
                            />
                        </div>

                        {settings.show_social_bio !== 'false' && settings.social_links && (() => {
                            let links = [];
                            try {
                                const parsed = JSON.parse(settings.social_links);
                                if (Array.isArray(parsed)) links = parsed;
                            } catch {
                                links = settings.social_links.split(',').filter((s: string) => s.includes(':')).map((s: string) => {
                                    const [label, ...urlParts] = s.split(':');
                                    return { label: label.trim(), url: urlParts.join(':').trim(), platform: 'custom' };
                                });
                            }

                            if (links.length === 0) return null;



                            return (
                                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                                    <h3 style={{ fontFamily: 'var(--font-jersey)', fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--foreground)' }}>Connect with the Lab</h3>
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                        {links.map((link: any, i: number) => (
                                            <a 
                                                key={i} 
                                                href={formatSocialUrl(link.url, link.platform)} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                style={{ 
                                                    background: 'var(--primary)', 
                                                    color: '#fff', 
                                                    padding: '0.5rem 1.5rem', 
                                                    fontFamily: 'var(--font-inter)', 
                                                    fontWeight: 'bold', 
                                                    fontSize: '0.9rem',
                                                    textDecoration: 'none',
                                                    border: '4px solid #000',
                                                    boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                {link.label || link.platform || "Link"}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}
