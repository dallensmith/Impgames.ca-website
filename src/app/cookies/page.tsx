export default function CookiesPage() {
    return (
        <div className="legal-page" style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1rem' }}>
            <h1 style={{ fontFamily: 'var(--font-bowlby)', color: 'var(--primary)', marginBottom: '2rem' }}>Cookie Policy</h1>
            
            <div className="legal-content" style={{ lineHeight: '1.8', opacity: 0.9 }}>
                <p style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>Last Updated: {new Date().toLocaleDateString()}</p>
                
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>1. What Are Cookies</h2>
                    <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>2. How We Use Cookies</h2>
                    <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>3. The Cookies We Set</h2>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                        <li>
                            <strong>Login related cookies:</strong> We use cookies when you are logged in as an administrator so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.
                        </li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>4. Disabling Cookies</h2>
                    <p>You can prevent the setting of cookies by adjusting the settings on your browser. Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>5. Third Party Cookies</h2>
                    <p>In some special cases we also use cookies provided by trusted third parties. This site uses Better Auth and SQLite for secure session management.</p>
                </section>
            </div>
        </div>
    );
}
