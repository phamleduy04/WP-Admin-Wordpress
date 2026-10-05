/**
 * Admin List Content Script
 * Outlines the row a Find in WordPress link points to (#post-<id>)
 */
import { defineContentScript } from 'wxt/utils/define-content-script';
import './style.css';

export default defineContentScript({
  matches: ['*://sites.utdallas.edu/*/wp-admin/edit.php*'],
  main() {
    const row = document.getElementById(location.hash.slice(1));
    if (!row?.closest('#the-list')) return;

    row.classList.add('wpas-found');
    row.scrollIntoView({ block: 'center' });
    // A reload keeps the hash, which would outline the row again
    history.replaceState(null, '', location.pathname + location.search);
  },
});
