/**
 * Find in WordPress Feature
 * Opens the admin list searched by the post's title, scrolled to its row
 */
import { findPost } from "../utils/findPost";

// @ts-ignore
const browser = globalThis.browser ?? globalThis.chrome;


/**
 * Converts a URL to the admin list URL for its post, e.g.
 * https://ece.utdallas.edu/wp-admin/edit.php?post_type=page&s=Home&orderby=relevance#post-491
 */
export async function convertToListUrl(url: string, tabId: number): Promise<string | null> {
  if (!new URL(url).hostname.endsWith('utdallas.edu')) {
    return null; // Not a UTDallas site
  }

  const post = await findPost(url, tabId);
  if (!post) {
    return null;
  }

  const response = await fetch(`${post.siteUrl}/wp-json/wp/v2/${post.restBase}/${post.id}?_fields=type,title`);
  if (!response.ok) {
    return null;
  }
  const { type, title } = await response.json();
  const search = new DOMParser().parseFromString(title.rendered, 'text/html').documentElement.textContent ?? '';

  // Relevance puts title matches first: by default "Engineering Home" matches 95 pages and
  // post 33 is not on the first screen. #post-<id> is the row's id in the list: the
  // admin-list content script scrolls to it and outlines it
  return `${post.siteUrl}/wp-admin/edit.php?post_type=${type}&s=${encodeURIComponent(search)}&orderby=relevance#post-${post.id}`;
}

/**
 * Set up the find in WordPress button
 */
export function setupFindInWordPress(button: HTMLElement | null): void {
  button?.addEventListener("click", async function () {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tabs[0].url;

    if (currentUrl && tabs[0].id) {
      try {
        const listUrl = await convertToListUrl(currentUrl, tabs[0].id);
        if (listUrl) {
          await browser.tabs.update(tabs[0].id, { url: listUrl });
        } else {
          alert("This page cannot be found in WordPress.");
        }
      } catch (error) {
        console.error("Error finding page:", error);
        alert("Error finding page: " + error);
      }
    }
  });
}
