// Background service worker for Chrome extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('FlashBlaze VPN extension installed');
  
  // Initialize default settings
  chrome.storage.local.set({
    connectionStatus: 'disconnected',
    connectedCountry: null,
    connectedProxy: null
  });
});

// Listen for proxy errors
chrome.proxy.onProxyError.addListener((details) => {
  console.error('Proxy error:', details);
  
  // Notify user of proxy error
  chrome.storage.local.get(['connectionStatus'], (result) => {
    if (result.connectionStatus === 'connected') {
      chrome.storage.local.set({
        connectionStatus: 'disconnected',
        connectedCountry: null,
        connectedProxy: null
      });
      
      // Optionally show notification (requires notifications permission)
      // chrome.notifications?.create({
      //   type: 'basic',
      //   iconUrl: 'icons/icon48.png',
      //   title: 'VPN Disconnected',
      //   message: 'Connection lost due to proxy error'
      // });
    }
  });
});

// Handle messages from popup/content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getConnectionStatus') {
    chrome.storage.local.get(
      ['connectionStatus', 'connectedCountry', 'connectedProxy'],
      (result) => {
        sendResponse({
          status: result.connectionStatus || 'disconnected',
          country: result.connectedCountry,
          proxy: result.connectedProxy
        });
      }
    );
    return true; // Keep channel open for async response
  }
});

// Keep service worker alive
chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(() => {
    console.log('Port disconnected');
  });
});

