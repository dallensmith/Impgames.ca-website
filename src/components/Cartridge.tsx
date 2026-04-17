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
                <div className="section-title-container" style={{ marginBottom: '1.5rem' }}>
                    <h2 className="section-title">{title}</h2>
                </div>
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
