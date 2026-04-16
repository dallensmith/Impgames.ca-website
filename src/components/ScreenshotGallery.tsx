"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function ScreenshotGallery({ images, title }: { images: any[], title: string }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % images.length);
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
        }
    };

    const closeLightbox = () => {
        setSelectedIndex(null);
    };

    const openLightbox = (index: number) => {
        setSelectedIndex(index);
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex]);

    const lightboxContent = selectedIndex !== null ? (
        <div 
            onClick={closeLightbox}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                cursor: 'default',
            }}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                style={{ 
                    position: 'relative', 
                    width: '90%', 
                    height: '90%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                }}
            >
                <button 
                    onClick={prevImage}
                    style={{
                        position: 'absolute',
                        left: '20px',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        border: '2px solid #fff',
                        width: '60px',
                        height: '60px',
                        cursor: 'pointer',
                        fontSize: '2rem',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    &lt;
                </button>

                <img 
                    src={images[selectedIndex].url} 
                    alt="Full scale screenshot"
                    style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        border: '4px solid #fff',
                        background: '#000',
                        objectFit: 'contain',
                        boxShadow: '0 0 50px rgba(0,0,0,0.5)'
                    }} 
                />

                <button 
                    onClick={nextImage}
                    style={{
                        position: 'absolute',
                        right: '20px',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        border: '2px solid #fff',
                        width: '60px',
                        height: '60px',
                        cursor: 'pointer',
                        fontSize: '2rem',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                     &gt;
                </button>

                <button 
                    onClick={closeLightbox}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: '#fff',
                        border: 'none',
                        color: '#000',
                        padding: '0.8rem 1.5rem',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        zIndex: 20
                    }}
                >
                    CLOSE [X]
                </button>
            </div>
        </div>
    ) : null;

    return (
        <div className="game-gallery">
            <h3 style={{ color: '#fff', borderBottom: '2px solid #333', paddingBottom: '1rem', marginTop: '2rem', fontFamily: 'var(--font-jersey)' }}>SCREENSHOTS</h3>
            
            <div className="gallery-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
                gap: '1rem', 
                marginTop: '1.5rem' 
            }}>
                {images.map((img, index) => (
                    <div 
                        key={img.id} 
                        onClick={() => openLightbox(index)}
                        style={{ 
                            cursor: 'pointer', 
                            border: '2px solid #333', 
                            aspectRatio: '1', 
                            overflow: 'hidden',
                            transition: 'all 0.2s ease',
                            background: '#000',
                            position: 'relative'
                        }}
                    >
                        <img 
                            src={img.url} 
                            alt={`${title} screenshot ${index + 1}`} 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover'
                            }} 
                        />
                    </div>
                ))}
            </div>

            {mounted && selectedIndex !== null && createPortal(lightboxContent, document.body)}
        </div>
    );
}
