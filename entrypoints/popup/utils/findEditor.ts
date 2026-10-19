// @ts-ignore
const browser = globalThis.browser ?? globalThis.chrome;

export interface Editor {
    siteUrl: string;  // e.g. https://sites.utdallas.edu/txace
    siteName: string; // e.g. TxACE
    id: string;
    type: string;     // e.g. page, post
    typeName: string; // e.g. Page, Post, Email
    title: string;    // the saved title, which is what the admin list search matches
    publishedLink: string | null; // null for drafts, which visitors can't open
}

/**
 * Function to read the post from the block editor, which keeps it in wp.data, so it runs in
 * the page's own world. The admin bar and body class are in the page even in fullscreen mode
 */
function readEditor() {
    // @ts-ignore
    const editor = window.wp?.data?.select('core/editor');
    const title: string | undefined = editor?.getCurrentPostAttribute('title');
    const publishedLink: string | null = editor?.getCurrentPostAttribute('status') === 'publish' ? editor.getCurrentPostAttribute('link') : null;
    const type = document.body.className.match(/\bpost-type-([\w-]+)/)?.[1];
    // @ts-ignore
    const typeName: string = (type && window.wp?.data?.select('core').getPostType(type)?.labels?.singular_name) ?? type;
    const siteName = document.querySelector('#wp-admin-bar-site-name > a')?.textContent ?? '';
    return title === undefined || !type ? null : { title, type, typeName, siteName, publishedLink };
}

/**
 * Finds the post being edited in a tab, e.g.
 * https://sites.utdallas.edu/txace/wp-admin/post.php?post=4166&action=edit
 */
export const findEditor = async (url: string, tabId: number): Promise<Editor | null> => {
    const { origin, pathname, searchParams } = new URL(url);
    const id = searchParams.get('post');
    if (!pathname.endsWith('/wp-admin/post.php') || searchParams.get('action') !== 'edit' || !id) {
        return null;
    }

    try {
        const results = await browser.scripting.executeScript({
            target: { tabId },
            world: 'MAIN',
            func: readEditor
        });
        const post = results?.[0]?.result;
        if (post) {
            return { siteUrl: origin + pathname.slice(0, -'/wp-admin/post.php'.length), id, ...post };
        }
    } catch (error) {
        console.error('Error reading the editor:', error);
    }
    return null;
}
