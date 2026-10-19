/**
 * Media Library Feature
 * Opens the Media Library of the site being edited in a new tab
 */
import type { Editor } from "../utils/findEditor";

// @ts-ignore
const browser = globalThis.browser ?? globalThis.chrome;

/**
 * Set up the open media library button
 */
export function setupMediaLibrary(button: HTMLElement | null, editor: Editor): void {
  button?.addEventListener("click", async function () {
    await browser.tabs.create({ url: `${editor.siteUrl}/wp-admin/upload.php` });
  });
}
