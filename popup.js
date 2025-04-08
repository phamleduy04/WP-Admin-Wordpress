document.addEventListener("DOMContentLoaded", function () {
  // Get the buttons
  const switchToAdminBtn = document.getElementById("switchToAdmin");
  const switchToNormalBtn = document.getElementById("switchToNormal");

  // Handle switching to admin
  switchToAdminBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url;
      const adminUrl = convertToAdminUrl(currentUrl);
      if (adminUrl) {
        chrome.tabs.update(tabs[0].id, { url: adminUrl });
      } else {
        alert("This doesn't appear to be a WordPress site.");
      }
    });
  });

  // Handle switching to normal site
  switchToNormalBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url;
      const normalUrl = convertToNormalUrl(currentUrl);
      if (normalUrl) {
        chrome.tabs.update(tabs[0].id, { url: normalUrl });
      } else {
        alert("This doesn't appear to be a WordPress admin page.");
      }
    });
  });

  // Function to convert normal URL to admin URL
  function convertToAdminUrl(url) {
    // Parse the URL
    try {
      const urlObj = new URL(url);

      // Handle UTDallas specific case
      if (urlObj.hostname === "be.utdallas.edu") {
        const path = urlObj.pathname;
        return `https://sites.utdallas.edu/be${path}`;
      }

      // Handle standard WordPress sites
      // This is a simplistic check and might need refinement
      return `${urlObj.origin}/wp-admin/`;
    } catch (e) {
      console.error("Invalid URL:", e);
      return null;
    }
  }

  // Function to convert admin URL to normal URL
  function convertToNormalUrl(url) {
    // Parse the URL
    try {
      const urlObj = new URL(url);

      // Handle UTDallas specific case
      if (
        urlObj.hostname === "sites.utdallas.edu" &&
        urlObj.pathname.startsWith("/be/")
      ) {
        const path = urlObj.pathname.replace("/be", "");
        return `https://be.utdallas.edu${path}`;
      }

      // Handle standard WordPress admin URLs
      if (urlObj.pathname.includes("/wp-admin/")) {
        return urlObj.origin;
      }

      return null;
    } catch (e) {
      console.error("Invalid URL:", e);
      return null;
    }
  }
});
