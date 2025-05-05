import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'WordPress Admin Switcher',
    description: 'Switch between WordPress pages and their admin versions',
    version: '1.0',
    permissions: ['tabs', 'activeTab', 'scripting'],
    host_permissions: ['*://*.utdallas.edu/*'],
  },
  srcDir: '.',
  outDir: '.output',
  webExt: {
    startUrls: ['https://engineering.utdallas.edu/']
  }
});

