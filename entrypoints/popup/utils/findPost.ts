// @ts-ignore
const browser = globalThis.browser ?? globalThis.chrome;

export interface Post {
    siteUrl: string;  // e.g. https://ece.utdallas.edu or https://sites.utdallas.edu/jonssonemails
    restBase: string; // e.g. pages, posts, emails
    id: string;
}

const REST_LINK = /^(.+)\/wp-json\/wp\/v2\/([\w-]+)\/(\d+)$/;

/**
 * Function to read the REST link WordPress prints in the page head,
 * e.g. https://ece.utdallas.edu/wp-json/wp/v2/pages/491
 */
function extractRestLink() {
    const link = document.querySelector<HTMLLinkElement>('link[rel="alternate"][type="application/json"]');
    return link ? link.href : null;
}

/**
 * Finds the WordPress post shown in a tab
 * This uses scripting.executeScript to run code in the context of the webpage
 */
export const findPost = async (url: string, tabId: number): Promise<Post | null> => {
    try {
        const results = await browser.scripting.executeScript({
            target: { tabId },
            func: extractRestLink
        });

        // The result is an array with the result from each frame
        // We just need the first one (main frame)
        const match = results?.[0]?.result?.match(REST_LINK);
        if (match) {
            return { siteUrl: match[1], restBase: match[2], id: match[3] };
        }
    } catch (error) {
        console.error('Error reading the REST link:', error);
    }
    return findPostBySlug(url);
}

/**
 * The email template prints no REST link, so ask the site's REST API by slug:
 * sites.utdallas.edu/jonssonemails/emails/<slug>/ -> /jonssonemails/wp-json/wp/v2/emails?slug=<slug>
 */
async function findPostBySlug(url: string): Promise<Post | null> {
    const { hostname, origin, pathname } = new URL(url);
    const [site, ...path] = pathname.split('/').filter(Boolean);
    if (hostname !== 'sites.utdallas.edu' || path.length < 2) return null;

    const [restBase, slug] = path.slice(-2);
    const siteUrl = `${origin}/${site}`;
    const response = await fetch(`${siteUrl}/wp-json/wp/v2/${restBase}?slug=${encodeURIComponent(slug)}&_fields=id`);
    if (!response.ok) return null;

    const [post] = await response.json();
    return post ? { siteUrl, restBase, id: String(post.id) } : null;
}
