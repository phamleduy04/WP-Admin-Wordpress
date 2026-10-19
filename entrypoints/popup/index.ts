/**
 * WordPress Admin Switcher Popup
 * Main entry point that initializes all features
 */

import './style.css';
import { setupAdminSwitcher } from './features/admin-switcher';
import { setupNormalSwitcher } from './features/normal-switcher';
import { setupEditPage } from './features/edit-page';
import { setupFindInWordPress } from './features/find-in-wordpress';
import { setupMediaLibrary } from './features/media-library';
import { setupLivePage } from './features/live-page';
import { findEditor, type Editor } from './utils/findEditor';

// @ts-ignore
const browser = globalThis.browser ?? globalThis.chrome;

/**
 * In the editor, name the post and keep only the buttons that open a new tab:
 * the others would leave the editor, and Edit This Page would reload it
 */
function showEditor(editor: Editor, findInWordPressBtn: HTMLElement | null): void {
  document.getElementById("editorSiteName")!.textContent = editor.siteName;
  document.getElementById("editorMeta")!.textContent = `(${editor.typeName} #${editor.id})`;
  document.getElementById("editorTitle")!.textContent = editor.title || "(no title)";
  document.getElementById("editorContext")!.hidden = false;

  const mediaLibraryBtn = document.getElementById("openMediaLibrary");
  setupMediaLibrary(mediaLibraryBtn, editor);
  mediaLibraryBtn!.hidden = false;
  findInWordPressBtn?.append(mediaLibraryBtn!.querySelector("svg")!.cloneNode(true));

  if (editor.publishedLink) {
    const livePageBtn = document.getElementById("viewLivePage");
    setupLivePage(livePageBtn, editor.publishedLink);
    livePageBtn!.append(mediaLibraryBtn!.querySelector("svg")!.cloneNode(true));
    livePageBtn!.hidden = false;
  }

  for (const id of ["switchToAdmin", "switchToNormal", "editThisPage"]) {
    document.getElementById(id)!.hidden = true;
  }
}

// Initialize the popup immediately when the script runs
document.addEventListener('DOMContentLoaded', async () => {

  // Get the buttons
  const switchToAdminBtn = document.getElementById("switchToAdmin");
  const switchToNormalBtn = document.getElementById("switchToNormal");
  const editThisPageBtn = document.getElementById("editThisPage");
  const findInWordPressBtn = document.getElementById("findInWordPress");

  // Set up each feature
  setupAdminSwitcher(switchToAdminBtn);
  setupNormalSwitcher(switchToNormalBtn);
  setupEditPage(editThisPageBtn);

  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const editor = tab?.url && tab.id ? await findEditor(tab.url, tab.id) : null;
  setupFindInWordPress(findInWordPressBtn, editor);
  if (editor) {
    showEditor(editor, findInWordPressBtn);
  }
});
