// Background service worker for Chrome extension

let keepAliveInterval = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const KEEP_ALIVE_INTERVAL = 30000; // 30 seconds
const RECONNECT_DELAY = 5000; // 5 seconds

chrome.runtime.onInstalled.addListener(() => {
  console.log('FlashBlaze VPN extension installed');
  
  // Initialize default settings
  chrome.storage.local.set({
    connectionStatus: 'disconnected',
    connectedCountry: null,
    connectedProxy: null
  });
  
  // Restore connection if it was previously connected
  restoreConnection();
});

// Restore connection on service worker startup
chrome.runtime.onStartup.addListener(() => {
  restoreConnection();
});

// Restore connection when service worker wakes up
function restoreConnection() {
  chrome.storage.local.get(
    ['connectionStatus', 'connectedCountry', 'connectedProxy'],
    (result) => {
      if (chrome.runtime.lastError) {
        console.warn('Error restoring connection:', chrome.runtime.lastError.message);
        return;
      }
      
      if (result.connectionStatus === 'connected' && result.connectedProxy) {
        console.log('Restoring VPN connection...');
        // Reset reconnect attempts when restoring
        reconnectAttempts = 0;
        reconnectVPN(result.connectedProxy, result.connectedCountry);
      }
    }
  );
}

// Verify VPN connection is working by making a test request
function verifyVPNConnection(proxyConfig, countryCode, callback) {
  // Run verification asynchronously to not block the connection
  setTimeout(() => {
    try {
      // Check if fetch is available
      if (typeof fetch === 'undefined') {
        console.warn('VPN checkpoint: fetch not available, skipping verification');
        if (callback) callback(false, null);
        return;
      }

      // Make a test request to check if proxy is working
      // Using a simple HTTP request to verify connectivity
      const testUrl = 'https://api.ipify.org?format=json';
      
      fetch(testUrl, {
        method: 'GET',
        cache: 'no-cache'
      })
        .then(response => {
          if (response && response.ok) {
            return response.json().catch(() => {
              // If JSON parsing fails, try text
              return response.text().then(text => {
                try {
                  return JSON.parse(text);
                } catch {
                  return { ip: 'unknown' };
                }
              });
            });
          }
          throw new Error('Test request failed');
        })
        .then(data => {
          if (data && data.ip) {
            console.log('VPN checkpoint: Connection verified, IP:', data.ip);
            // Store the IP for reference
            chrome.storage.local.set({ vpnIP: data.ip });
            if (callback) callback(true, data.ip);
          } else {
            console.warn('VPN checkpoint: Invalid response data');
            if (callback) callback(false, null);
          }
        })
        .catch(error => {
          console.warn('VPN checkpoint: Verification failed, but connection may still work:', error);
          // Don't fail the connection if verification fails - proxy might still work
          if (callback) callback(false, null);
        });
    } catch (error) {
      console.warn('VPN checkpoint: Could not initiate verification:', error);
      // Don't fail the connection if verification fails
      if (callback) callback(false, null);
    }
  }, 100); // Small delay to ensure proxy is active
}

// Reconnect VPN automatically
function reconnectVPN(proxyConfig, countryCode) {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('Max reconnection attempts reached');
    chrome.storage.local.set({
      connectionStatus: 'disconnected',
      connectedCountry: null,
      connectedProxy: null
    });
    return;
  }

  reconnectAttempts++;
  console.log(`Reconnecting VPN (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);

  const proxyServer = {
    host: proxyConfig.host,
    port: proxyConfig.port,
    scheme: proxyConfig.type === 'socks5' ? 'socks5' : 
           proxyConfig.type === 'socks4' ? 'socks4' : 'http'
  };

  const config = {
    mode: 'fixed_servers',
    rules: {
      singleProxy: proxyServer
    }
  };

  chrome.proxy.settings.set(
    { value: config, scope: 'regular' },
    () => {
      if (chrome.runtime.lastError) {
        const errorMsg = chrome.runtime.lastError.message || 'Unknown error';
        console.error('Reconnection failed:', errorMsg);
        // Retry after delay - FIX: Pass both parameters
        setTimeout(() => reconnectVPN(proxyConfig, countryCode), RECONNECT_DELAY);
      } else {
        console.log('VPN reconnected successfully');
        reconnectAttempts = 0;
        // Verify connection after reconnecting
        verifyVPNConnection(proxyConfig, countryCode, (verified, ip) => {
          if (verified) {
            console.log('VPN checkpoint passed - connection verified');
          }
        });
        startKeepAlive(proxyConfig, countryCode);
      }
    }
  );
}

// Start keep-alive mechanism
function startKeepAlive(proxyConfig, countryCode) {
  // Clear existing interval
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }

  keepAliveInterval = setInterval(() => {
    // Verify connection is still active
    chrome.proxy.settings.get({}, (details) => {
      if (chrome.runtime.lastError) {
        console.warn('Error checking proxy settings:', chrome.runtime.lastError.message);
        return;
      }
      
      chrome.storage.local.get(['connectionStatus'], (result) => {
        if (chrome.runtime.lastError) {
          console.warn('Error getting connection status:', chrome.runtime.lastError.message);
          return;
        }
        
        if (result.connectionStatus === 'connected') {
          // Check if proxy settings are still set
          if (!details.value || details.value.mode === 'direct' || 
              (details.value.mode === 'fixed_servers' && 
               (!details.value.rules || !details.value.rules.singleProxy))) {
            console.log('Connection lost, reconnecting...');
            reconnectVPN(proxyConfig, countryCode);
          } else {
            // Connection is still active, reset reconnect attempts
            reconnectAttempts = 0;
          }
        }
      });
    });
  }, KEEP_ALIVE_INTERVAL);
}

// Stop keep-alive mechanism
function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
  reconnectAttempts = 0;
}

// Listen for proxy errors - auto-reconnect instead of disconnecting
chrome.proxy.onProxyError.addListener((details) => {
  // Log proxy error details properly - handle all possible formats
  try {
    // Extract safe, serializable properties
    const errorMessage = typeof details.error === 'string' 
      ? details.error 
      : (details.error && typeof details.error === 'object' && details.error.message)
        ? details.error.message
        : String(details.error || 'Unknown proxy error');
    
    const errorUrl = typeof details.url === 'string' ? details.url : String(details.url || 'Unknown URL');
    const isFatal = details.fatal === true;
    const errorDetails = typeof details.details === 'string' ? details.details : String(details.details || 'No additional details');
    
    // Log in a readable format
    console.error('Proxy error detected:', {
      error: errorMessage,
      url: errorUrl,
      fatal: isFatal,
      details: errorDetails
    });
  } catch (e) {
    // Ultimate fallback - log what we can
    console.error('Proxy error occurred (unable to parse details):', String(e));
    console.error('Raw details type:', typeof details);
    if (details && typeof details === 'object') {
      console.error('Details keys:', Object.keys(details));
    }
  }
  
  chrome.storage.local.get(['connectionStatus', 'connectedProxy', 'connectedCountry'], (result) => {
    if (chrome.runtime.lastError) {
      console.warn('Error getting connection status for proxy error:', chrome.runtime.lastError.message);
      return;
    }
    
    if (result.connectionStatus === 'connected' && result.connectedProxy) {
      console.log('Proxy error detected, attempting to reconnect...');
      // Don't disconnect, instead try to reconnect
      setTimeout(() => {
        reconnectVPN(result.connectedProxy, result.connectedCountry);
      }, RECONNECT_DELAY);
    } else {
      console.warn('Proxy error occurred but no active connection to restore');
    }
  });
});

// Handle messages from popup/content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === 'getConnectionStatus') {
      chrome.storage.local.get(
        ['connectionStatus', 'connectedCountry', 'connectedProxy'],
        (result) => {
          if (chrome.runtime.lastError) {
            console.warn('Error getting connection status:', chrome.runtime.lastError.message);
            sendResponse({
              status: 'disconnected',
              country: null,
              proxy: null
            });
            return;
          }
          
          sendResponse({
            status: result.connectionStatus || 'disconnected',
            country: result.connectedCountry || null,
            proxy: result.connectedProxy || null
          });
        }
      );
      return true; // Keep channel open for async response
    }
    
    if (request.action === 'startKeepAlive') {
      chrome.storage.local.get(['connectedProxy', 'connectedCountry'], (result) => {
        if (chrome.runtime.lastError) {
          console.warn('Error starting keep-alive:', chrome.runtime.lastError.message);
          sendResponse({ success: false });
          return;
        }
        
        if (result.connectedProxy) {
          startKeepAlive(result.connectedProxy, result.connectedCountry);
          sendResponse({ success: true });
        } else {
          console.warn('No connected proxy found for keep-alive');
          sendResponse({ success: false });
        }
      });
      return true;
    }
    
    if (request.action === 'stopKeepAlive') {
      stopKeepAlive();
      sendResponse({ success: true });
      return true;
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ success: false, error: error.message });
    return false;
  }
});

// Keep service worker alive
chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(() => {
    console.log('Port disconnected');
  });
});

