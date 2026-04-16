import { db } from "@/lib/db";
import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage() {
    const settings = await db.query.siteSettings.findMany();
    const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));

    return (
        <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ 
                marginBottom: '2rem', 
                fontSize: '2rem', 
                borderBottom: '4px solid var(--foreground)',
                paddingBottom: '0.5rem',
                display: 'inline-block'
            }}>
                Site Configuration
            </h2>
            
            <SettingsForm settingsMap={settingsMap} />
        </div>
    );
}
