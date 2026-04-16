export default function TermsPage() {
    return (
        <div className="legal-page" style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1rem' }}>
            <h1 style={{ fontFamily: 'var(--font-bowlby)', color: 'var(--primary)', marginBottom: '2rem' }}>Terms of Service</h1>
            
            <div className="legal-content" style={{ lineHeight: '1.8', opacity: 0.9 }}>
                <p style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>Last Updated: {new Date().toLocaleDateString()}</p>
                
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>1. Terms</h2>
                    <p>By accessing Impgames.ca, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>2. Use License</h2>
                    <p>Permission is granted to temporarily download one copy of the materials (information or software) on Impgames.ca for personal, non-commercial transitory viewing only.</p>
                    <p style={{ marginTop: '1rem' }}>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                        <li>Modify or copy the materials.</li>
                        <li>Use the materials for any commercial purpose.</li>
                        <li>Attempt to decompile or reverse engineer any software contained on the site.</li>
                        <li>Remove any copyright or other proprietary notations from the materials.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>3. Disclaimer</h2>
                    <p>The materials on Impgames.ca are provided on an 'as is' basis. Impgames.ca makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>4. Limitations</h2>
                    <p>In no event shall Impgames.ca or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Impgames.ca.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)', borderBottom: '2px solid #000', paddingBottom: '0.5rem', marginBottom: '1rem' }}>5. Accuracy of Materials</h2>
                    <p>The materials appearing on Impgames.ca could include technical, typographical, or photographic errors. Impgames.ca does not warrant that any of the materials on its website are accurate, complete or current.</p>
                </section>
            </div>
        </div>
    );
}
