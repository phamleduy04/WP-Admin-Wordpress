// @ts-ignore
const browser = globalThis.browser ?? globalThis.chrome;

/**
 * Function to extract the WordPress page ID from the page HTML
 */
function extractPageId() {
    const pageSource = document.documentElement.innerHTML;
    const apiRegex = /wp-json\/wp\/v2\/pages\/(\d+)/g;
    const apiMatch = apiRegex.exec(pageSource);
    return apiMatch ? apiMatch[1] : null;
}

/**
 * Gets the WordPress page ID from the current tab
 * This uses scripting.executeScript to run code in the context of the webpage
 */
export const getPageId = async (): Promise<string | null> => {
    try {
        // Get the current active tab
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tabs?.[0]?.id) return null;
        
        // Execute script in the context of the webpage to get the page ID
        const results = await browser.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: extractPageId
        });
        
        // The result is an array with the result from each frame
        // We just need the first one (main frame)
        return results?.[0]?.result ?? null;
    } catch (error) {
        console.error('Error getting page ID:', error);
        return null;
    }
}
