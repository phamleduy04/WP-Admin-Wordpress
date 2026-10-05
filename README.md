# WordPress Admin Switcher for UTDallas

A browser extension that helps navigate between WordPress admin pages and normal pages specifically for UTDallas websites.

## Features

- Switch from normal pages to WordPress admin pages
- Switch from WordPress admin pages to normal pages
- Edit WordPress pages directly from the frontend
- Find the current page in the WordPress admin list, with its row outlined

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

Every push to `main` runs `.github/workflows/release.yml`. When the version in `wxt.config.ts` has no GitHub Release yet, the workflow:
- Builds the Chrome and Firefox ZIPs
- Creates a GitHub Release with both ZIPs attached
- Submits the new version to the Chrome Web Store and Firefox Add-ons for review

To release, bump `version` in `wxt.config.ts` and push to `main`.

To check store credentials without submitting, run the workflow manually from the Actions tab with **dry_run** checked.

The submit step needs these repository secrets: `CHROME_EXTENSION_ID`, `CHROME_CLIENT_ID`, `CHROME_CLIENT_SECRET`, `CHROME_REFRESH_TOKEN`, `FIREFOX_EXTENSION_ID`, `FIREFOX_JWT_ISSUER`, `FIREFOX_JWT_SECRET`. Run `pnpm wxt submit init` locally for a guided walkthrough of where to find each value.

### Testing a pull request

Every PR runs `.github/workflows/pr-build.yml`, which attaches unpacked Chrome and Firefox builds to the run. Open the PR's **Checks** tab, choose **PR Build**, and download the artifact under **Artifacts**. Then unzip it and:
- Chrome: go to `chrome://extensions/`, enable Developer mode, click "Load unpacked", and select the unzipped folder
- Firefox: go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select `manifest.json` in the unzipped folder

### Building from source (Firefox review)

```bash
pnpm install
pnpm zip:firefox
```

The extension ZIP is written to `.output/`.
