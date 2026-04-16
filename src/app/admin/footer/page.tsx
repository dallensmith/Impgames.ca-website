import { db } from "@/lib/db";
import FooterForm from "@/components/FooterForm";

export default async function AdminFooterPage() {
    const settings = await db.query.siteSettings.findMany();
    const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ 
                marginBottom: '2rem', 
                fontSize: '2.5rem', 
                borderBottom: '6px solid var(--foreground)',
                paddingBottom: '0.5rem',
                display: 'inline-block',
                fontFamily: 'var(--font-bowlby)',
                textTransform: 'uppercase'
            }}>
                Footer Configuration
            </h2>
            
            <FooterForm settingsMap={settingsMap} />
        </div>
    );
}
