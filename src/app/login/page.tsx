"use client";

import { authClient } from "@/lib/auth/client";

export default function LoginPage() {
    const handleLogin = async () => {
        await authClient.signIn.social({
            provider: "discord",
            callbackURL: "/admin"
        });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center', border: '4px solid #000', padding: '3rem', background: '#fff' }}>
                <h2 style={{ marginBottom: '2rem' }}>Admin Access</h2>
                <p style={{ marginBottom: '2rem', opacity: 0.7 }}>Sign in with Discord to manage your NES games archive.</p>
                <button 
                    onClick={handleLogin}
                    style={{ background: '#5865F2', padding: '1rem 2rem', fontSize: '1.2rem' }}
                >
                    Login with Discord
                </button>
            </div>
        </div>
    );
}
