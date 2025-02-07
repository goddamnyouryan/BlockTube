const homePageURLs = [
  'https://www.youtube.com/',
  'https://m.youtube.com/',
]

const subscriptionURLs = [
  'https://www.youtube.com/feed/subscriptions',
  'https://m.youtube.com/feed/subscriptions',
]

const shortsURLs = [
  'https://www.youtube.com/shorts',
  'https://m.youtube.com/shorts ',
]

let settings = {
    blockHomepage: true,
    blockSubscriptions: true,
    blockShorts: true,
    blockEmbeddedShorts: true,
    blockRecommendedVideos: true,
    disableAutoplay: true
};

function loadSettings() {
    return new Promise((resolve) => {
        browser.storage.local.get('settings', (result) => {
            if (result.settings) {
                settings = result.settings;
            }
            resolve();
        });
    });
}

browser.webNavigation.onBeforeNavigate.addListener(async (details) => {
    console.log("onBeforeNavigate", details);
    await loadSettings();
    
    if (details.frameId === 0) { // Only handle main frame navigation
        console.log(details.url)
        if (settings.blockHomepage && homePageURLs.includes(details.url)) {
            browser.tabs.update(details.tabId, { url: browser.runtime.getURL('blocked.html') });
        } else if (settings.blockSubscriptions && subscriptionURLs.includes(details.url)) {
            browser.tabs.update(details.tabId, { url: browser.runtime.getURL('blocked.html') });
        } else if (settings.blockShorts && shortsURLs.includes(details.url)) {
            browser.tabs.update(details.tabId, { url: browser.runtime.getURL('blocked.html') });
        }
    }
}, {
    url: [
        { hostEquals: 'www.youtube.com' },
        { hostEquals: 'm.youtube.com' }
    ]
});

browser.webRequest.onBeforeRequest.addListener((r) => {
    console.log("onBeforeRequest", r);
}, {
    url: [
        { hostEquals: 'www.youtube.com' },
        { hostEquals: 'm.youtube.com' }
    ]
})

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
        loadSettings().then(() => {
            sendResponse(settings);
        });
        return true; // Indicates we will send a response asynchronously
    } else if (request.action === 'updateSettings') {
        settings = request.settings;
        browser.storage.local.set({ settings });
    }
});
