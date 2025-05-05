/**
 * Admin Switcher Feature
 * Handles switching from normal pages to WordPress admin pages
 */

// @ts-ignore
const browser = globalThis.browser ?? globalThis.chrome;

/**
 * Converts a normal URL to a WordPress admin URL
 */
export function convertToAdminUrl(url: string): string | null {
  // Parse the URL
  try {
    const urlObj = new URL(url);

    // Handle UTDallas specific case
    if (urlObj.hostname === "be.utdallas.edu") {
      const path = urlObj.pathname;
      return `https://sites.utdallas.edu/be${path}`;
    }

    // Handle standard WordPress sites
    // This is a simplistic check and might need refinement
    return `${urlObj.origin}/wp-admin/`;
  } catch (e) {
    console.error("Invalid URL:", e);
    return null;
  }
}

/**
 * Set up the admin switcher button
 */
export function setupAdminSwitcher(button: HTMLElement | null): void {
  button?.addEventListener("click", async function () {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tabs[0].url;
    
    if (currentUrl && tabs[0].id) {
      const adminUrl = convertToAdminUrl(currentUrl);
      if (adminUrl) {
        await browser.tabs.update(tabs[0].id, { url: adminUrl });
      } else {
        alert("This doesn't appear to be a WordPress site.");
      }
    }
  });
}
