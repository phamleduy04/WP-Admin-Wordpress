/**
 * Live Page Feature
 * Opens the published post at the address visitors see, in a new tab
 */
// @ts-ignore
const browser = globalThis.browser ?? globalThis.chrome;

/**
 * WordPress links https://sites.utdallas.edu/txace/txace-2026-symposium/, which redirects
 * visitors to https://txace.utdallas.edu/txace-2026-symposium/ but answers logged-in users
 * directly, so ask without cookies and keep the address it ends at
 */
async function findLiveUrl(link: string): Promise<string> {
  try {
    const response = await fetch(link, { method: 'HEAD', credentials: 'omit' });
    return response.url;
  } catch (error) {
    console.error('Error following the link:', error);
    return link;
  }
}

/**
 * Set up the view live page button
 */
export function setupLivePage(button: HTMLElement | null, link: string): void {
  button?.addEventListener("click", async function () {
    await browser.tabs.create({ url: await findLiveUrl(link) });
  });
}
