/**
 * Edit Page Feature
 * Handles converting UTDallas URLs for web editing
 */
import { findPost } from "../utils/findPost";

// @ts-ignore
const browser = globalThis.browser ?? globalThis.chrome;


/**
 * Converts a URL to an edit URL for UTDallas sites
 */
export async function convertToEditUrl(url: string, tabId: number): Promise<string | null> {
  if (!new URL(url).hostname.endsWith('utdallas.edu')) {
    return null; // Not a UTDallas site
  }

  const post = await findPost(url, tabId);
  if (!post) {
    return null;
  }

  // A site's own domain redirects /wp-admin/ to its sites.utdallas.edu path, which is
  // not always the subdomain (ece.utdallas.edu is sites.utdallas.edu/ece-2023)
  return `${post.siteUrl}/wp-admin/post.php?post=${post.id}&action=edit`;
}

/**
 * Set up the edit page button
 */
export function setupEditPage(button: HTMLElement | null): void {
  button?.addEventListener("click", async function () {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tabs[0].url;
    
    if (currentUrl && tabs[0].id) {
      try {
        const editUrl = await convertToEditUrl(currentUrl, tabs[0].id);
        if (editUrl) {
          await browser.tabs.update(tabs[0].id, { url: editUrl });
        } else {
          alert("This URL cannot be converted for editing.");
        }
      } catch (error) {
        console.error("Error converting URL:", error);
        alert("Error converting URL: " + error);
      }
    }
  });
}
