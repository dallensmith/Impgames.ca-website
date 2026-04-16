"use client";

import { useEffect, useState } from "react";

interface Summary {
    requests: number;
    pageViews: number;
    uniques: number;
    bandwidth: string;
}

interface Item {
    name?: string;
    type?: string;
    requests: number;
}

interface StatsData {
    summary: Summary;
    countries: Item[];
    devices: Item[];
    error?: string;
    not_configured?: boolean;
}

type Tab = 'overview' | 'locations' | 'devices';

export default function CloudflareStats() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats/cloudflare");
                const data = await res.json();
                
                if (data.error === "not_configured") {
                    setStats({ not_configured: true } as any);
                } else if (res.ok) {
                    setStats(data);
                } else {
                    setStats({ error: data.error || "Failed to load stats" } as any);
                }
            } catch (err) {
                setStats({ error: "Connection error" } as any);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) return (
        <div className="admin-card centered" style={{ opacity: 0.5, minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem' }}>Fetching live metrics...</p>
        </div>
    );

    if (stats?.not_configured) return (
        <div className="admin-card" style={{ border: '2px dashed rgba(0,0,0,0.15)', background: 'transparent', minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8, fontFamily: 'var(--font-bowlby)' }}>Analytics Offline</h3>
            <p style={{ fontSize: '0.75rem', opacity: 0.5, fontFamily: 'var(--font-inter)', lineHeight: '1.4' }}>
                Add Cloudflare credentials to your .env to see real-time visitor stats here.
            </p>
        </div>
    );

    if (stats?.error) return (
        <div className="admin-card centered" style={{ border: '2px solid rgba(231, 76, 60, 0.3)', minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#c0392b', fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'var(--font-inter)' }}>⚠ {stats.error}</p>
        </div>
    );

    const renderTabContent = () => {
        if (!stats) return null;

        switch (activeTab) {
            case 'overview':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', animation: 'fadeIn 0.3s ease' }}>
                        <div>
                            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, fontWeight: 'bold' }}>Uniq Visitors (Peak Pulse)</span>
                            <p style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-bowlby)' }}>{stats.summary.uniques.toLocaleString()}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, fontWeight: 'bold' }}>Total Requests</span>
                            <p style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-bowlby)' }}>{stats.summary.requests.toLocaleString()}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, fontWeight: 'bold' }}>Page Views</span>
                            <p style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-bowlby)' }}>{stats.summary.pageViews.toLocaleString()}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, fontWeight: 'bold' }}>Bandwidth (24H)</span>
                            <p style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-bowlby)' }}>{stats.summary.bandwidth}</p>
                        </div>
                    </div>
                );
            case 'locations':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', animation: 'fadeIn 0.3s ease' }}>
                        {stats.countries.map((c, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '0.3rem' }}>
                                <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-inter)' }}>{c.name || 'Unknown'}</span>
                                <span style={{ fontFamily: 'var(--font-bowlby)', color: 'var(--primary)' }}>{c.requests.toLocaleString()} <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>REQS</span></span>
                            </div>
                        ))}
                        {stats.countries.length === 0 && <p style={{ opacity: 0.5 }}>No location data available.</p>}
                    </div>
                );
            case 'devices':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', animation: 'fadeIn 0.3s ease' }}>
                        {stats.devices.map((d, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '0.3rem' }}>
                                <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'var(--font-inter)' }}>{d.type || 'Desktop'}</span>
                                <span style={{ fontFamily: 'var(--font-bowlby)', color: 'var(--primary)' }}>{d.requests.toLocaleString()} <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>REQS</span></span>
                            </div>
                        ))}
                         {stats.devices.length === 0 && <p style={{ opacity: 0.5 }}>No device data available.</p>}
                    </div>
                );
        }
    };

    return (
        <div className="admin-card" style={{ minHeight: '300px' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ 
                    fontFamily: 'var(--font-bowlby)', 
                    color: 'var(--primary)', 
                    fontSize: '1rem',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#2ecc71', borderRadius: '50%', boxShadow: '0 0 8px #2ecc71' }}></span>
                    CLOUD ANALYTICS
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['overview', 'locations', 'devices'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="button"
                            style={{ 
                                fontSize: '0.65rem', 
                                padding: '0.4rem 0.8rem',
                                background: activeTab === tab ? '#000' : 'rgba(0,0,0,0.05)',
                                color: activeTab === tab ? '#fff' : '#000',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: 'var(--font-jersey)'
                            }}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {renderTabContent()}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
