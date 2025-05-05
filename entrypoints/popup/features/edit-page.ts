/**
 * Edit Page Feature
 * Handles converting UTDallas URLs for web editing
 */
import { getPageId } from "../utils/getPageId";

// @ts-ignore
const browser = globalThis.browser ?? globalThis.chrome;


/**
 * Converts a URL to an edit URL for UTDallas sites
 */
export async function convertToEditUrl(url: string): Promise<string | null> {
  // Check if the URL is for a UTDallas site
  try {
    const urlObj = new URL(url);
    
    // Check if we're already on sites.utdallas.edu
    if (urlObj.hostname === 'sites.utdallas.edu') {
      return null; // Already on sites.utdallas.edu
    }
    
    // Check if it's a utdallas.edu domain
    if (!urlObj.hostname.endsWith('utdallas.edu')) {
      return null; // Not a UTDallas site
    }
    
    // Split the hostname into parts
    const hostParts = urlObj.hostname.split('.');
    
    // Check if there's a subdomain before 'utdallas.edu'
    if (hostParts.length > 2) {
      const subdomain = hostParts[0];
      
      // Change the hostname to 'sites.utdallas.edu'
      urlObj.hostname = 'sites.utdallas.edu';
      
      // Move the subdomain to the beginning of the pathname
      urlObj.pathname = '/' + subdomain + urlObj.pathname;

      // Get the page ID asynchronously
      const pageId = await getPageId();
      
      if (pageId) {
        urlObj.pathname = `/${subdomain}/wp-admin/post.php`;
        return urlObj.toString()+`?post=${pageId}&action=edit`;
      }
      
      // Create the edit URL with login and parameters
      return `https://sites.utdallas.edu/wp-login.php?privacy=1&redirect_to=${encodeURIComponent(urlObj.toString())}`;
    }
    
    return null; // No subdomain found
  } catch (e) {
    console.error("Invalid URL:", e);
    return null;
  }
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
        const editUrl = await convertToEditUrl(currentUrl);
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
