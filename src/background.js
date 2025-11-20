// Background service worker for Chrome extension

// Global error handlers to catch all unhandled errors
self.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  event.preventDefault(); // Prevent default error handling
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent default error handling
});

let keepAliveInterval = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const KEEP_ALIVE_INTERVAL = 30000; // 30 seconds
const RECONNECT_DELAY = 5000; // 5 seconds

// Safe wrapper for Chrome API calls
function safeChromeCall(callback, errorHandler) {
  try {
    return callback();
  } catch (error) {
    console.error('Chrome API call error:', error);
    if (errorHandler) {
      errorHandler(error);
    }
    return null;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  try {
    console.log('FlashBlaze VPN extension installed');
    
    // Initialize default settings
    safeChromeCall(() => {
      chrome.storage.local.set({
        connectionStatus: 'disconnected',
        connectedCountry: null,
        connectedProxy: null
      }, () => {
        if (chrome.runtime.lastError) {
          console.warn('Error initializing storage:', chrome.runtime.lastError.message);
        }
      });
    });
    
    // Restore connection if it was previously connected
    restoreConnection();
  } catch (error) {
    console.error('Error in onInstalled:', error);
  }
});

// Restore connection on service worker startup
chrome.runtime.onStartup.addListener(() => {
  restoreConnection();
});

// Restore connection when service worker wakes up
function restoreConnection() {
  try {
    safeChromeCall(() => {
      chrome.storage.local.get(
        ['connectionStatus', 'connectedCountry', 'connectedProxy'],
        (result) => {
          try {
            if (chrome.runtime.lastError) {
              console.warn('Error restoring connection:', chrome.runtime.lastError.message);
              return;
            }
            
            if (result && result.connectionStatus === 'connected' && result.connectedProxy) {
              console.log('Restoring VPN connection...');
              // Reset reconnect attempts when restoring
              reconnectAttempts = 0;
              reconnectVPN(result.connectedProxy, result.connectedCountry);
            }
          } catch (error) {
            console.error('Error in restoreConnection callback:', error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in restoreConnection:', error);
  }
}

// Verify VPN connection is working by making a test request
function verifyVPNConnection(proxyConfig, countryCode, callback) {
  try {
    // Run verification asynchronously to not block the connection
    setTimeout(() => {
      try {
        // Check if fetch is available
        if (typeof fetch === 'undefined') {
          console.warn('VPN checkpoint: fetch not available, skipping verification');
          if (callback) {
            try {
              callback(false, null);
            } catch (e) {
              console.error('Error in verifyVPNConnection callback:', e);
            }
          }
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
            try {
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
            } catch (e) {
              console.warn('Error processing response:', e);
              throw e;
            }
          })
          .then(data => {
            try {
              if (data && data.ip) {
                console.log('VPN checkpoint: Connection verified, IP:', data.ip);
                // Store the IP for reference
                safeChromeCall(() => {
                  chrome.storage.local.set({ vpnIP: data.ip }, () => {
                    if (chrome.runtime.lastError) {
                      console.warn('Error storing VPN IP:', chrome.runtime.lastError.message);
                    }
                  });
                });
                if (callback) {
                  try {
                    callback(true, data.ip);
                  } catch (e) {
                    console.error('Error in verifyVPNConnection callback:', e);
                  }
                }
              } else {
                console.warn('VPN checkpoint: Invalid response data');
                if (callback) {
                  try {
                    callback(false, null);
                  } catch (e) {
                    console.error('Error in verifyVPNConnection callback:', e);
                  }
                }
              }
            } catch (e) {
              console.error('Error processing verification data:', e);
              if (callback) {
                try {
                  callback(false, null);
                } catch (err) {
                  console.error('Error in verifyVPNConnection callback:', err);
                }
              }
            }
          })
          .catch(error => {
            console.warn('VPN checkpoint: Verification failed, but connection may still work:', error);
            // Don't fail the connection if verification fails - proxy might still work
            if (callback) {
              try {
                callback(false, null);
              } catch (e) {
                console.error('Error in verifyVPNConnection callback:', e);
              }
            }
          });
      } catch (error) {
        console.warn('VPN checkpoint: Could not initiate verification:', error);
        // Don't fail the connection if verification fails
        if (callback) {
          try {
            callback(false, null);
          } catch (e) {
            console.error('Error in verifyVPNConnection callback:', e);
          }
        }
      }
    }, 100); // Small delay to ensure proxy is active
  } catch (error) {
    console.error('Error in verifyVPNConnection:', error);
    if (callback) {
      try {
        callback(false, null);
      } catch (e) {
        console.error('Error in verifyVPNConnection callback:', e);
      }
    }
  }
}

// Reconnect VPN automatically
function reconnectVPN(proxyConfig, countryCode) {
  try {
    if (!proxyConfig || !proxyConfig.host || !proxyConfig.port) {
      console.error('Invalid proxy config for reconnection');
      return;
    }

    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached');
      safeChromeCall(() => {
        chrome.storage.local.set({
          connectionStatus: 'disconnected',
          connectedCountry: null,
          connectedProxy: null
        }, () => {
          if (chrome.runtime.lastError) {
            console.warn('Error updating connection status:', chrome.runtime.lastError.message);
          }
        });
      });
      return;
    }

    reconnectAttempts++;
    console.log(`Reconnecting VPN (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);

    const proxyServer = {
      host: String(proxyConfig.host),
      port: Number(proxyConfig.port),
      scheme: proxyConfig.type === 'socks5' ? 'socks5' : 
             proxyConfig.type === 'socks4' ? 'socks4' : 'http'
    };

    const config = {
      mode: 'fixed_servers',
      rules: {
        singleProxy: proxyServer
      }
    };

    safeChromeCall(() => {
      chrome.proxy.settings.set(
        { value: config, scope: 'regular' },
        () => {
          try {
            if (chrome.runtime.lastError) {
              const errorMsg = chrome.runtime.lastError.message || 'Unknown error';
              console.error('Reconnection failed:', errorMsg);
              // Retry after delay - FIX: Pass both parameters
              setTimeout(() => {
                try {
                  reconnectVPN(proxyConfig, countryCode);
                } catch (e) {
                  console.error('Error in reconnectVPN retry:', e);
                }
              }, RECONNECT_DELAY);
            } else {
              console.log('VPN reconnected successfully');
              reconnectAttempts = 0;
              // Verify connection after reconnecting
              verifyVPNConnection(proxyConfig, countryCode, (verified, ip) => {
                try {
                  if (verified) {
                    console.log('VPN checkpoint passed - connection verified');
                  }
                } catch (e) {
                  console.error('Error in verifyVPNConnection callback:', e);
                }
              });
              startKeepAlive(proxyConfig, countryCode);
            }
          } catch (error) {
            console.error('Error in reconnectVPN callback:', error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in reconnectVPN:', error);
  }
}

// Start keep-alive mechanism
function startKeepAlive(proxyConfig, countryCode) {
  try {
    // Clear existing interval
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }

    if (!proxyConfig || !proxyConfig.host) {
      console.error('Invalid proxy config for keep-alive');
      return;
    }

    keepAliveInterval = setInterval(() => {
      try {
        // Verify connection is still active
        safeChromeCall(() => {
          chrome.proxy.settings.get({}, (details) => {
            try {
              if (chrome.runtime.lastError) {
                console.warn('Error checking proxy settings:', chrome.runtime.lastError.message);
                return;
              }
              
              safeChromeCall(() => {
                chrome.storage.local.get(['connectionStatus'], (result) => {
                  try {
                    if (chrome.runtime.lastError) {
                      console.warn('Error getting connection status:', chrome.runtime.lastError.message);
                      return;
                    }
                    
                    if (result && result.connectionStatus === 'connected') {
                      // Check if proxy settings are still set
                      if (!details || !details.value || details.value.mode === 'direct' || 
                          (details.value.mode === 'fixed_servers' && 
                           (!details.value.rules || !details.value.rules.singleProxy))) {
                        console.log('Connection lost, reconnecting...');
                        reconnectVPN(proxyConfig, countryCode);
                      } else {
                        // Connection is still active, reset reconnect attempts
                        reconnectAttempts = 0;
                      }
                    }
                  } catch (error) {
                    console.error('Error in keep-alive storage callback:', error);
                  }
                });
              });
            } catch (error) {
              console.error('Error in keep-alive proxy settings callback:', error);
            }
          });
        });
      } catch (error) {
        console.error('Error in keep-alive interval:', error);
      }
    }, KEEP_ALIVE_INTERVAL);
  } catch (error) {
    console.error('Error in startKeepAlive:', error);
  }
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
  try {
    // Log proxy error details properly - handle all possible formats
    try {
      // Extract safe, serializable properties
      const errorMessage = typeof details?.error === 'string' 
        ? details.error 
        : (details?.error && typeof details.error === 'object' && details.error.message)
          ? details.error.message
          : String(details?.error || 'Unknown proxy error');
      
      const errorUrl = typeof details?.url === 'string' ? details.url : String(details?.url || 'Unknown URL');
      const isFatal = details?.fatal === true;
      const errorDetails = typeof details?.details === 'string' ? details.details : String(details?.details || 'No additional details');
      
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
        try {
          console.error('Details keys:', Object.keys(details));
        } catch (err) {
          console.error('Could not get details keys:', err);
        }
      }
    }
    
    safeChromeCall(() => {
      chrome.storage.local.get(['connectionStatus', 'connectedProxy', 'connectedCountry'], (result) => {
        try {
          if (chrome.runtime.lastError) {
            console.warn('Error getting connection status for proxy error:', chrome.runtime.lastError.message);
            return;
          }
          
          if (result && result.connectionStatus === 'connected' && result.connectedProxy) {
            console.log('Proxy error detected, attempting to reconnect...');
            // Don't disconnect, instead try to reconnect
            setTimeout(() => {
              try {
                reconnectVPN(result.connectedProxy, result.connectedCountry);
              } catch (e) {
                console.error('Error in proxy error reconnection:', e);
              }
            }, RECONNECT_DELAY);
          } else {
            console.warn('Proxy error occurred but no active connection to restore');
          }
        } catch (error) {
          console.error('Error in proxy error handler callback:', error);
        }
      });
    });
  } catch (error) {
    console.error('Error in proxy error listener:', error);
  }
});

// Handle messages from popup/content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (!request || typeof request !== 'object') {
      console.warn('Invalid message request:', request);
      sendResponse({ success: false, error: 'Invalid request' });
      return false;
    }

    if (request.action === 'getConnectionStatus') {
      safeChromeCall(() => {
        chrome.storage.local.get(
          ['connectionStatus', 'connectedCountry', 'connectedProxy'],
          (result) => {
            try {
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
                status: result?.connectionStatus || 'disconnected',
                country: result?.connectedCountry || null,
                proxy: result?.connectedProxy || null
              });
            } catch (error) {
              console.error('Error in getConnectionStatus callback:', error);
              sendResponse({
                status: 'disconnected',
                country: null,
                proxy: null
              });
            }
          }
        );
      });
      return true; // Keep channel open for async response
    }
    
    if (request.action === 'startKeepAlive') {
      safeChromeCall(() => {
        chrome.storage.local.get(['connectedProxy', 'connectedCountry'], (result) => {
          try {
            if (chrome.runtime.lastError) {
              console.warn('Error starting keep-alive:', chrome.runtime.lastError.message);
              sendResponse({ success: false });
              return;
            }
            
            if (result && result.connectedProxy) {
              startKeepAlive(result.connectedProxy, result.connectedCountry);
              sendResponse({ success: true });
            } else {
              console.warn('No connected proxy found for keep-alive');
              sendResponse({ success: false });
            }
          } catch (error) {
            console.error('Error in startKeepAlive callback:', error);
            sendResponse({ success: false });
          }
        });
      });
      return true;
    }
    
    if (request.action === 'stopKeepAlive') {
      try {
        stopKeepAlive();
        sendResponse({ success: true });
      } catch (error) {
        console.error('Error stopping keep-alive:', error);
        sendResponse({ success: false, error: error.message });
      }
      return true;
    }

    // Unknown action
    console.warn('Unknown action:', request.action);
    sendResponse({ success: false, error: 'Unknown action' });
    return false;
  } catch (error) {
    console.error('Error handling message:', error);
    try {
      sendResponse({ success: false, error: error?.message || 'Unknown error' });
    } catch (e) {
      console.error('Error sending error response:', e);
    }
    return false;
  }
});

// Keep service worker alive
chrome.runtime.onConnect.addListener((port) => {
  try {
    if (port) {
      port.onDisconnect.addListener(() => {
        try {
          console.log('Port disconnected');
        } catch (error) {
          console.error('Error in port disconnect handler:', error);
        }
      });
    }
  } catch (error) {
    console.error('Error in onConnect handler:', error);
  }
});

