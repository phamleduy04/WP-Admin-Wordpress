/**
 * Admin Switcher Feature
 * Handles switching from normal pages to WordPress admin pages
 */

// @ts-ignore
const browser = globalThis.browser ?? globalThis.chrome;

/**
 * Function to read the REST API root WordPress prints in the head of every page,
 * e.g. https://labs.utdallas.edu/ccst/wp-json/
 */
function readApiRoot() {
  const link = document.querySelector<HTMLLinkElement>('link[rel="https://api.w.org/"]');
  return link ? link.href : null;
}

/**
 * Finds the address of the WordPress site shown in a tab. The domain is not enough:
 * labs.utdallas.edu/ccst/ is its own site, and labs.utdallas.edu/wp-admin/ is the
 * Research Labs site, which most editors cannot open
 */
async function findSiteUrl(url: string, tabId: number): Promise<string> {
  try {
    const results = await browser.scripting.executeScript({
      target: { tabId },
      func: readApiRoot
    });
    const apiRoot: string | null | undefined = results?.[0]?.result;
    if (apiRoot?.endsWith("/wp-json/")) {
      return apiRoot.slice(0, -"wp-json/".length);
    }
  } catch (error) {
    console.error("Error reading the page:", error);
  }
  return `${new URL(url).origin}/`;
}

/**
 * Converts a normal URL to a WordPress admin URL
 */
export async function convertToAdminUrl(url: string, tabId: number): Promise<string | null> {
  // Parse the URL
  try {
    const urlObj = new URL(url);

    // Handle UTDallas specific case
    if (urlObj.hostname === "be.utdallas.edu") {
      const path = urlObj.pathname;
      return `https://sites.utdallas.edu/be${path}`;
    }

    // Handle standard WordPress sites
    return `${await findSiteUrl(url, tabId)}wp-admin/`;
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
      const adminUrl = await convertToAdminUrl(currentUrl, tabs[0].id);
      if (adminUrl) {
        await browser.tabs.update(tabs[0].id, { url: adminUrl });
      } else {
        alert("This doesn't appear to be a WordPress site.");
      }
    }
  });
}
