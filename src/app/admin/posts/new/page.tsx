import PostForm from "@/components/PostForm";

export default function NewPostPage() {
    return (
        <div className="admin-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ 
                marginBottom: '2rem', 
                fontSize: '2rem', 
                borderBottom: '4px solid var(--foreground)',
                paddingBottom: '0.5rem',
                display: 'inline-block'
            }}>
                Add New Game
            </h2>
            <div style={{ marginTop: '2rem' }}>
                <PostForm />
            </div>
        </div>
    );
}
