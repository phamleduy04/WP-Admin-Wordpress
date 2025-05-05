/**
 * Normal Switcher Feature
 * Handles switching from WordPress admin pages to normal pages
 */

// @ts-ignore
const browser = globalThis.browser ?? globalThis.chrome;

/**
 * Converts a WordPress admin URL to a normal URL
 */
export function convertToNormalUrl(url: string): string | null {
  // Parse the URL
  try {
    const urlObj = new URL(url);

    // Handle UTDallas specific case
    if (
      urlObj.hostname === "sites.utdallas.edu" &&
      urlObj.pathname.startsWith("/be/")
    ) {
      const path = urlObj.pathname.replace("/be", "");
      return `https://be.utdallas.edu${path}`;
    }

    // Handle standard WordPress admin URLs
    if (urlObj.pathname.includes("/wp-admin/")) {
      return urlObj.origin;
    }

    return null;
  } catch (e) {
    console.error("Invalid URL:", e);
    return null;
  }
}

/**
 * Set up the normal switcher button
 */
export function setupNormalSwitcher(button: HTMLElement | null): void {
  button?.addEventListener("click", async function () {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tabs[0].url;
    
    if (currentUrl && tabs[0].id) {
      const normalUrl = convertToNormalUrl(currentUrl);
      if (normalUrl) {
        await browser.tabs.update(tabs[0].id, { url: normalUrl });
      } else {
        alert("This doesn't appear to be a WordPress admin page.");
      }
    }
  });
}