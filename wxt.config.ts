import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'UT Dallas WordPress Admin Switcher',
    description: 'Switch between WordPress pages and their admin versions (for UT Dallas websites)',
    version: '1.1.1',
    permissions: ['tabs', 'activeTab', 'scripting'],
    host_permissions: ['*://*.utdallas.edu/*'],
    icons: {
      '16': 'icon16.png',
      '48': 'icon48.png',
      '128': 'icon128.png'
    },
  },
  srcDir: '.',
  outDir: '.output',
  publicDir: 'images',
  webExt: {
    startUrls: ['https://engineering.utdallas.edu/']
  }
});

