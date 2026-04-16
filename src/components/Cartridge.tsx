import React from "react";

interface CartridgeProps {
    title?: string;
    children: React.ReactNode;
    labelImage?: string;
}

export default function Cartridge({ title, children, labelImage }: CartridgeProps) {
    return (
        <>
            {title && (
                <h2 className="external-cartridge-title" style={{ 
                    textAlign: 'center', 
                    fontSize: '4rem', 
                    marginBottom: '1rem', 
                    color: 'var(--primary)',
                    fontFamily: 'var(--font-bowlby)',
                    textTransform: 'uppercase',
                    textShadow: '4px 4px 0px rgba(0,0,0,0.2)'
                }}>
                    {title}
                </h2>
            )}
            <div className="cartridge">
                <div className="cartridge-top"></div>
                <div className="cartridge-body">
                    <div className="cartridge-recessed-area" style={{ background: '#000', display: 'flex', flexDirection: 'column', marginLeft: '34.4%', marginTop: '-99px', width: '54.2%', position: 'relative', zIndex: 10, boxShadow: 'inset 0 0 20px #000' }}>
                        <div className="cartridge-label" style={{ overflow: 'hidden' }}>
                            {labelImage ? (
                                <img 
                                    src={labelImage} 
                                    alt={title || "Cartridge Label"} 
                                    className="cartridge-label-img" 
                                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', borderBottom: '4px solid #111' }}
                                />
                            ) : (
                                <div className="empty-label" style={{ padding: '4rem 2rem', textAlign: 'center', border: '2px dashed #333', opacity: 0.5, color: '#fff' }}>
                                    {title || "NES GAME"}
                                </div>
                            )}
                        </div>
                        <div className="cartridge-content" style={{ color: '#fff' }}>
                            {children}
                        </div>
                    </div>
                </div>
                <div className="cartridge-footer">
                    <div className="cartridge-bottom-pins"></div>
                </div>
            </div>
        </>
    );
}
