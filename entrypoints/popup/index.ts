/**
 * WordPress Admin Switcher Popup
 * Main entry point that initializes all features
 */

import './style.css';
import { setupAdminSwitcher } from './features/admin-switcher';
import { setupNormalSwitcher } from './features/normal-switcher';
import { setupEditPage } from './features/edit-page';
import { setupFindInWordPress } from './features/find-in-wordpress';

// Initialize the popup immediately when the script runs
document.addEventListener('DOMContentLoaded', () => {
  
  // Get the buttons
  const switchToAdminBtn = document.getElementById("switchToAdmin");
  const switchToNormalBtn = document.getElementById("switchToNormal");
  const editThisPageBtn = document.getElementById("editThisPage");
  const findInWordPressBtn = document.getElementById("findInWordPress");

  // Set up each feature
  setupAdminSwitcher(switchToAdminBtn);
  setupNormalSwitcher(switchToNormalBtn);
  setupEditPage(editThisPageBtn);
  setupFindInWordPress(findInWordPressBtn);
});
