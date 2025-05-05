# WordPress Admin Switcher for UTDallas

A browser extension that helps navigate between WordPress admin pages and normal pages specifically for UTDallas websites.

## Features

- Switch from normal pages to WordPress admin pages
- Switch from WordPress admin pages to normal pages
- Edit WordPress pages directly from the frontend

## Installation

### Chrome
1. Download the latest Chrome version from the [Releases](https://github.com/phamleduy04/WP-Admin-Wordpress/releases) page
2. Go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extracted extension folder

### Firefox
1. Download the latest Firefox version from the [Releases](https://github.com/phamleduy04/WP-Admin-Wordpress/releases) page
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on" and select the downloaded .zip file

## Development

This extension is built with [WXT (Web Extension Tools)](https://wxt.dev/).

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Create distribution ZIP files
npm run zip
```

## Releasing New Versions

This project uses GitHub Actions to automatically build and release the extension when a new version tag is pushed.

To release a new version:

1. Update the version number in `wxt.config.ts`
2. Commit your changes
3. Create and push a new tag:

```bash
git tag v1.0.1
git push origin v1.0.1
```

GitHub Actions will automatically:
- Build both Chrome and Firefox versions
- Create ZIP files for distribution
- Create a new GitHub Release with the ZIP files attached