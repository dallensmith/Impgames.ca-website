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
                    fontSize: '2.8rem', 
                    marginBottom: '1rem', 
                    color: 'var(--primary)',
                    fontFamily: 'var(--font-bowlby)',
                    textTransform: 'uppercase',
                    textShadow: '3px 3px 0px rgba(0,0,0,0.15)',
                    letterSpacing: '-1px',
                    lineHeight: '1.1'
                }}>
                    {title}
                </h2>
            )}
            <div className="cartridge">
                <div className="cartridge-top"></div>
                <div className="cartridge-body">
                    <div className="cartridge-recessed-area">
                        <div className="cartridge-label">
                            {labelImage ? (
                                <img 
                                    src={labelImage} 
                                    alt={title || "Cartridge Label"} 
                                    className="cartridge-label-img" 
                                />
                            ) : (
                                <div className="empty-label">
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
