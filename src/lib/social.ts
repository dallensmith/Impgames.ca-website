export function formatSocialUrl(url: string, platform: string): string {
    if (!url) return "#";
    
    // If it's already a full URL, return it
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:")) {
        return url;
    }

    const handle = url.replace("@", "");
    
    switch (platform) {
        case "twitter":
        case "x":
            return `https://twitter.com/${handle}`;
        case "discord":
            return url.startsWith("https://discord.gg/") ? url : `https://discord.gg/${handle}`;
        case "github":
            return `https://github.com/${handle}`;
        case "youtube":
            return `https://youtube.com/${url.startsWith("@") ? url : "@" + handle}`;
        case "bluesky":
            return `https://bsky.app/profile/${handle}`;
        case "mastodon":
            return url.includes("@") ? `https://${url.split("@")[1]}/@${url.split("@")[0]}` : url;
        case "itch":
            return `https://${handle}.itch.io`;
        case "patreon":
            return `https://patreon.com/${handle}`;
        default:
            // Fallback for custom links - if it looks like a domain, add https://
            if (url.includes(".") && !url.includes(" ")) {
                return `https://${url}`;
            }
            return url;
    }
}
