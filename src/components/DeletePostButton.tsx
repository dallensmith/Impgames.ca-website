"use client";

import { useState } from "react";
import { deletePost } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function DeletePostButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this game post? This cannot be undone.")) {
            return;
        }

        setLoading(true);
        try {
            await deletePost(id);
            router.refresh(); // Update the list
        } catch (error) {
            console.error(error);
            alert("Failed to delete post.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button 
            onClick={handleDelete} 
            disabled={loading}
            style={{ 
                color: 'red', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                padding: '0',
                marginLeft: '1rem',
                textDecoration: 'underline'
            }}
        >
            {loading ? "Deleting..." : "Delete"}
        </button>
    );
}
