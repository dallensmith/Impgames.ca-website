"use client";

import React, { useRef, useEffect, useState } from "react";
import { Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Eraser } from "lucide-react";

interface WysiwygEditorProps {
    id?: string;
    name: string;
    defaultValue?: string;
    placeholder?: string;
    style?: React.CSSProperties;
}

export default function WysiwygEditor({ id, name, defaultValue, placeholder, style }: WysiwygEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const selectionRangeRef = useRef<Range | null>(null);
    const [pendingUpload, setPendingUpload] = useState<HTMLImageElement | null>(null);
    const [html, setHtml] = useState(defaultValue || "");

    useEffect(() => {
        if (editorRef.current && defaultValue !== undefined) {
            editorRef.current.innerHTML = defaultValue.trim();
            setHtml(defaultValue.trim());
        }
    }, [defaultValue]);

    const handleInput = () => {
        if (editorRef.current) {
            setHtml(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, value?: string) => {
        if (command === 'createLink') {
            const url = window.prompt('Enter URL:');
            if (!url) return;
            document.execCommand(command, false, url);
        } else if (command === 'insertImage') {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                selectionRangeRef.current = sel.getRangeAt(0);
            }
            setPendingUpload(null);
            fileInputRef.current?.click();
            return;
        } else {
            document.execCommand(command, false, value);
        }
        handleInput();
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("file", file);
            
            const res = await fetch("/api/admin/media/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) {
                if (pendingUpload) {
                    pendingUpload.src = data.url;
                    setPendingUpload(null);
                    handleInput();
                } else {
                    if (editorRef.current) {
                        editorRef.current.focus();
                        const sel = window.getSelection();
                        if (sel && selectionRangeRef.current) {
                            sel.removeAllRanges();
                            sel.addRange(selectionRangeRef.current);
                        }
                    }
                    const style = 'max-width: 100%; height: auto;';
                    const imgHtml = `<img src="${data.url}" style="${style}" alt="" />&nbsp;`;
                    document.execCommand('insertHTML', false, imgHtml);
                    handleInput();
                }
            }
        } catch (err) {
            alert("Upload failed.");
            setPendingUpload(null);
        }
        
        e.target.value = '';
    };

    return (
        <div 
            className="wysiwyg-wrapper" 
            style={{ 
                border: '4px solid #000', 
                background: '#fff',
                boxShadow: '6px 6px 0 rgba(0,0,0,0.1)',
                marginBottom: '1.5rem',
                overflow: 'hidden'
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .wysiwyg-editor p { margin: 0 0 0.5em 0 !important; }
                .wysiwyg-editor ul, .wysiwyg-editor ol { padding-left: 1.5rem !important; margin-bottom: 0.5em !important; }
                .wysiwyg-editor *:last-child { margin-bottom: 0 !important; }
                .wysiwyg-editor img { cursor: ew-resize; transition: opacity 0.2s; }
                .wysiwyg-editor img:hover { opacity: 0.9; outline: 3px solid var(--primary); }
            ` }} />
            
            <div className="wysiwyg-toolbar" style={{ 
                display: 'flex', 
                gap: '0.4rem', 
                padding: '0.4rem 0.6rem', 
                background: 'var(--background)', 
                borderBottom: '4px solid #000',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                    <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
                        <Bold size={14} color="#fff" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
                        <Italic size={14} color="#fff" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand('underline')} title="Underline">
                        <UnderlineIcon size={14} color="#fff" />
                    </ToolbarButton>
                </div>
                
                <div style={{ width: '2px', height: '20px', background: 'rgba(0,0,0,0.2)', margin: '0 2px' }} />
                
                <div style={{ display: 'flex', gap: '2px' }}>
                    <ToolbarButton onClick={() => execCommand('justifyLeft')} title="Align Left">
                        <AlignLeft size={14} color="#fff" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand('justifyCenter')} title="Align Center">
                        <AlignCenter size={14} color="#fff" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand('justifyRight')} title="Align Right">
                        <AlignRight size={14} color="#fff" />
                    </ToolbarButton>
                </div>

                <div style={{ width: '2px', height: '20px', background: 'rgba(0,0,0,0.2)', margin: '0 2px' }} />

                <div style={{ display: 'flex', gap: '2px' }}>
                    <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
                        <List size={14} color="#fff" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
                        <ListOrdered size={14} color="#fff" />
                    </ToolbarButton>
                </div>

                <div style={{ width: '2px', height: '20px', background: 'rgba(0,0,0,0.2)', margin: '0 2px' }} />

                <div style={{ display: 'flex', gap: '2px' }}>
                    <ToolbarButton onClick={() => execCommand('insertImage')} title="Insert Image">
                        <ImageIcon size={14} color="#fff" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand('createLink')} title="Insert Link">
                        <LinkIcon size={14} color="#fff" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => execCommand('removeFormat')} title="Clear Formatting">
                        <Eraser size={14} color="#fff" />
                    </ToolbarButton>
                </div>

                <div style={{ flexGrow: 1 }} />
                <div style={{ fontSize: '0.5rem', opacity: 0.5, fontFamily: 'var(--font-bowlby)', color: 'var(--primary)' }}>THE LAB</div>
            </div>

            <div 
                ref={editorRef}
                id={id}
                contentEditable
                onInput={handleInput}
                onBlur={handleInput}
                onDragStart={(e) => {
                    if ((e.target as HTMLElement).tagName === 'IMG') {
                        e.preventDefault();
                    }
                }}
                onMouseDown={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName === 'IMG') {
                        const img = target as HTMLImageElement;
                        const startX = e.clientX;
                        const startWidth = img.offsetWidth;

                        let isResizing = false;

                        const handleMouseMove = (mvEvent: MouseEvent) => {
                            if (!isResizing && Math.abs(mvEvent.clientX - startX) > 3) {
                                isResizing = true;
                            }
                            if (isResizing) {
                                const newWidth = Math.max(20, startWidth + (mvEvent.clientX - startX));
                                img.style.width = `${newWidth}px`;
                                img.style.height = 'auto';
                            }
                        };

                        const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                            if (isResizing) {
                                handleInput();
                            }
                        };

                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                    }
                }}
                onDoubleClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName === 'IMG') {
                        const img = target as HTMLImageElement;
                        const action = window.prompt("Edit Image:\n1: Upload Replacement\n2: Change Alignment\n3: Delete\n\nEnter number:");
                        
                        if (action === '1') {
                            setPendingUpload(img);
                            fileInputRef.current?.click();
                        } else if (action === '2') {
                            const newAlign = window.prompt('Alignment (left, right, center, none):', img.style.float || 'none');
                            if (newAlign === 'center') {
                                img.style.display = 'block'; img.style.margin = '1rem auto'; img.style.float = 'none';
                            } else if (newAlign === 'left') {
                                img.style.float = 'left'; img.style.margin = '0 1rem 1rem 0'; img.style.display = 'inline';
                            } else if (newAlign === 'right') {
                                img.style.float = 'right'; img.style.margin = '0 0 1rem 1rem'; img.style.display = 'inline';
                            } else if (newAlign === 'none' || newAlign === '') {
                                img.style.float = 'none'; img.style.margin = '0'; img.style.display = 'inline';
                            }
                        } else if (action === '3') {
                            img.remove();
                        }
                        handleInput();
                    }
                }}
                className="wysiwyg-editor"
                style={{ 
                    minHeight: '120px', 
                    padding: '1rem', 
                    fontFamily: 'var(--font-inter)',
                    lineHeight: '1.6',
                    overflowY: 'auto',
                    outline: 'none',
                    color: '#111',
                    fontSize: '1rem',
                    ...style
                }}
            />
            
            <input type="hidden" name={name} value={html} />
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handleFileInput}
            />
        </div>
    );
}

function ToolbarButton({ children, onClick, title }: { children: React.ReactNode, onClick: () => void, title: string }) {
    return (
        <button 
            type="button" 
            onClick={onClick} 
            title={title}
            style={{ 
                width: '28px', 
                height: '28px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: '#222', 
                border: '1px solid #000', 
                cursor: 'pointer',
                transition: 'all 0.1s',
                padding: 0,
                boxShadow: '1px 1px 0 #000'
            }}
            onMouseDown={(e) => e.preventDefault()}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.background = '#222'}
        >
            {children}
        </button>
    );
}
