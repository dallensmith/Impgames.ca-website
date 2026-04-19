import React from "react";

import Link from "next/link";

interface CartridgeProps {
    title?: string;
    children: React.ReactNode;
    labelImage?: string;
    href?: string;
    titleExtra?: React.ReactNode;
}

export default function Cartridge({ title, children, labelImage, href, titleExtra }: CartridgeProps) {
    const cartridgeElement = (
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
    );

    return (
        <div className="cartridge-wrapper">
            {title && (
                <div className="section-title-container" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <h2 className="section-title" style={{ margin: 0 }}>
                         {href ? <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>{title}</Link> : title}
                    </h2>
                    {titleExtra}
                </div>
            )}
            {href ? (
                <Link href={href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    {cartridgeElement}
                </Link>
            ) : (
                cartridgeElement
            )}
        </div>
    );
}
