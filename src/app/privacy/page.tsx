export default function PrivacyPage() {
    return (
        <div className="legal-page" style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1rem' }}>
            <h1 style={{ fontFamily: 'var(--font-bowlby)', color: 'var(--primary)', marginBottom: '2rem' }}>Privacy Policy</h1>
            
            <div className="legal-content" style={{ lineHeight: '1.8', opacity: 0.9 }}>
                <p style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>Last Updated: {new Date().toLocaleDateString()}</p>
                
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>1. Introduction</h2>
                    <p>Welcome to Impgames.ca. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>2. The Data We Collect</h2>
                    <p>We do not collect any personal data from regular visitors. We only collect data required for administrative access (logins) via third-party providers like Discord. This may include your username and email address solely for authentication purposes.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>3. How We Use Your Data</h2>
                    <p>We use your data only to:</p>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                        <li>Provide and manage access to the admin dashboard.</li>
                        <li>Maintain the security and integrity of our website.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>4. Data Security</h2>
                    <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>5. Contact Us</h2>
                    <p>If you have any questions about this privacy policy, please contact us through our official social media channels listed in the footer.</p>
                </section>
            </div>
        </div>
    );
}
