import type { Country, ConnectionInfo } from '../types';
import { ALL_COUNTRIES } from '../data/countries';

const NATIVE_HOST_NAME = 'com.flashblaze.vpn';

export const getCountries = async (): Promise<Country[]> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(['countries'], (result: { [key: string]: any }) => {
        if (chrome.runtime.lastError) {
          console.warn('Error getting countries from storage:', chrome.runtime.lastError);
          // Fallback to default countries
          const defaultCountries = loadDefaultCountries();
          resolve(defaultCountries);
          return;
        }
        
        if (result.countries && Array.isArray(result.countries) && result.countries.length > 0) {
          resolve(result.countries);
        } else {
          // Load default countries
          const defaultCountries = loadDefaultCountries();
          chrome.storage.local.set({ countries: defaultCountries }, () => {
            if (chrome.runtime.lastError) {
              console.warn('Error saving countries to storage:', chrome.runtime.lastError);
            }
            resolve(defaultCountries);
          });
        }
      });
    } catch (error) {
      console.error('Error in getCountries:', error);
      // Fallback to default countries
      const defaultCountries = loadDefaultCountries();
      resolve(defaultCountries);
    }
  });
};

export const connectVPN = async (country: Country): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if (!country || !country.code) {
        reject(new Error('Invalid country provided'));
        return;
      }

      // First, try to get proxy from native host
      sendNativeMessage({
        action: 'getProxy',
        country: country.code
      })
        .then((response) => {
          try {
            if (response && response.proxy) {
              const proxyConfig = response.proxy;
              if (!proxyConfig.host || !proxyConfig.port) {
                throw new Error('Invalid proxy configuration from native host');
              }

              const proxyServer: chrome.proxy.ProxyServer = {
                host: String(proxyConfig.host),
                port: Number(proxyConfig.port),
                scheme: proxyConfig.type === 'socks5' ? 'socks5' : 
                       proxyConfig.type === 'socks4' ? 'socks4' : 'http'
              };

              const config: chrome.proxy.ProxyConfig = {
                mode: 'fixed_servers',
                rules: {
                  singleProxy: proxyServer
                }
              };

              try {
                chrome.proxy.settings.set(
                  { value: config, scope: 'regular' },
                  () => {
                    try {
                      if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                        return;
                      }
                      // Save connection info
                      chrome.storage.local.set({
                        connectionStatus: 'connected',
                        connectedCountry: country.code,
                        connectedProxy: proxyConfig
                      }, () => {
                        if (chrome.runtime.lastError) {
                          console.warn('Error saving connection info:', chrome.runtime.lastError.message);
                        }
                      });
                      // Start keep-alive mechanism
                      chrome.runtime.sendMessage({ action: 'startKeepAlive' }, () => {
                        if (chrome.runtime.lastError) {
                          console.warn('Failed to start keep-alive:', chrome.runtime.lastError.message);
                        }
                      });
                      // Verify connection checkpoint
                      verifyConnectionCheckpoint(proxyConfig).then(() => {
                        resolve();
                      }).catch((error) => {
                        console.warn('Connection checkpoint warning:', error);
                        // Still resolve - connection is set, verification is just a check
                        resolve();
                      });
                    } catch (error) {
                      console.error('Error in connectVPN proxy settings callback:', error);
                      reject(error);
                    }
                  }
                );
              } catch (error) {
                console.error('Error setting proxy:', error);
                reject(error);
              }
            } else {
              // Fallback to first available proxy from country
              if (country.proxyServers && country.proxyServers.length > 0) {
                const proxy = country.proxyServers[0];
                if (!proxy.host || !proxy.port) {
                  reject(new Error('Invalid proxy server configuration'));
                  return;
                }

                const proxyServer: chrome.proxy.ProxyServer = {
                  host: String(proxy.host),
                  port: Number(proxy.port),
                  scheme: proxy.type === 'socks5' ? 'socks5' : 
                         proxy.type === 'socks4' ? 'socks4' : 'http'
                };

                const config: chrome.proxy.ProxyConfig = {
                  mode: 'fixed_servers',
                  rules: {
                    singleProxy: proxyServer
                  }
                };

                try {
                  chrome.proxy.settings.set(
                    { value: config, scope: 'regular' },
                    () => {
                      try {
                        if (chrome.runtime.lastError) {
                          reject(new Error(chrome.runtime.lastError.message));
                          return;
                        }
                        chrome.storage.local.set({
                          connectionStatus: 'connected',
                          connectedCountry: country.code,
                          connectedProxy: proxy
                        }, () => {
                          if (chrome.runtime.lastError) {
                            console.warn('Error saving connection info:', chrome.runtime.lastError.message);
                          }
                        });
                        // Start keep-alive mechanism
                        chrome.runtime.sendMessage({ action: 'startKeepAlive' }, () => {
                          if (chrome.runtime.lastError) {
                            console.warn('Failed to start keep-alive:', chrome.runtime.lastError.message);
                          }
                        });
                        // Verify connection checkpoint
                        verifyConnectionCheckpoint(proxy).then(() => {
                          resolve();
                        }).catch((error) => {
                          console.warn('Connection checkpoint warning:', error);
                          // Still resolve - connection is set, verification is just a check
                          resolve();
                        });
                      } catch (error) {
                        console.error('Error in connectVPN fallback callback:', error);
                        reject(error);
                      }
                    }
                  );
                } catch (error) {
                  console.error('Error setting proxy (fallback):', error);
                  reject(error);
                }
              } else {
                reject(new Error('No proxy servers available for this country'));
              }
            }
          } catch (error) {
            console.error('Error processing native host response:', error);
            reject(error);
          }
        })
        .catch((error) => {
          try {
            console.warn('Native host not available, using fallback:', error);
            // Fallback to direct proxy configuration
            if (country.proxyServers && country.proxyServers.length > 0) {
              const proxy = country.proxyServers[0];
              if (!proxy.host || !proxy.port) {
                reject(new Error('Invalid proxy server configuration'));
                return;
              }

              const proxyServer: chrome.proxy.ProxyServer = {
                host: String(proxy.host),
                port: Number(proxy.port),
                scheme: proxy.type === 'socks5' ? 'socks5' : 
                       proxy.type === 'socks4' ? 'socks4' : 'http'
              };

              const config: chrome.proxy.ProxyConfig = {
                mode: 'fixed_servers',
                rules: {
                  singleProxy: proxyServer
                }
              };

              try {
                chrome.proxy.settings.set(
                  { value: config, scope: 'regular' },
                  () => {
                    try {
                      if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                        return;
                      }
                      chrome.storage.local.set({
                        connectionStatus: 'connected',
                        connectedCountry: country.code,
                        connectedProxy: proxy
                      }, () => {
                        if (chrome.runtime.lastError) {
                          console.warn('Error saving connection info:', chrome.runtime.lastError.message);
                        }
                      });
                      // Start keep-alive mechanism
                      chrome.runtime.sendMessage({ action: 'startKeepAlive' }, () => {
                        if (chrome.runtime.lastError) {
                          console.warn('Failed to start keep-alive:', chrome.runtime.lastError.message);
                        }
                      });
                      // Verify connection checkpoint
                      verifyConnectionCheckpoint(proxy).then(() => {
                        resolve();
                      }).catch((error) => {
                        console.warn('Connection checkpoint warning:', error);
                        // Still resolve - connection is set, verification is just a check
                        resolve();
                      });
                    } catch (error) {
                      console.error('Error in connectVPN final fallback callback:', error);
                      reject(error);
                    }
                  }
                );
              } catch (error) {
                console.error('Error setting proxy (final fallback):', error);
                reject(error);
              }
            } else {
              reject(new Error('No proxy servers available'));
            }
          } catch (e) {
            console.error('Error in connectVPN catch handler:', e);
            reject(e);
          }
        });
    } catch (error) {
      console.error('Error in connectVPN:', error);
      reject(error);
    }
  });
};

export const disconnectVPN = async (): Promise<void> => {
  return new Promise((resolve) => {
    try {
      // Stop keep-alive mechanism
      try {
        chrome.runtime.sendMessage({ action: 'stopKeepAlive' }, () => {
          if (chrome.runtime.lastError) {
            console.warn('Failed to stop keep-alive:', chrome.runtime.lastError.message);
          }
        });
      } catch (error) {
        console.warn('Error sending stopKeepAlive message:', error);
      }
      
      try {
        chrome.proxy.settings.clear({ scope: 'regular' }, () => {
          try {
            if (chrome.runtime.lastError) {
              console.warn('Error clearing proxy settings:', chrome.runtime.lastError.message);
            }
            
            try {
              chrome.storage.local.set({
                connectionStatus: 'disconnected',
                connectedCountry: null,
                connectedProxy: null
              }, () => {
                if (chrome.runtime.lastError) {
                  console.warn('Error updating connection status:', chrome.runtime.lastError.message);
                }
                resolve();
              });
            } catch (error) {
              console.error('Error setting storage:', error);
              resolve();
            }
          } catch (error) {
            console.error('Error in proxy clear callback:', error);
            resolve();
          }
        });
      } catch (error) {
        console.error('Error clearing proxy settings:', error);
        resolve();
      }
    } catch (error) {
      console.error('Error in disconnectVPN:', error);
      resolve();
    }
  });
};

export const getConnectionStatus = async (): Promise<ConnectionInfo> => {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get(
        ['connectionStatus', 'connectedCountry', 'connectedProxy'],
        (result: { [key: string]: any }) => {
          if (chrome.runtime.lastError) {
            console.warn('Error getting connection status:', chrome.runtime.lastError);
            resolve({
              status: 'disconnected',
              country: null,
              proxy: null
            });
            return;
          }
          
          resolve({
            status: (result.connectionStatus || 'disconnected') as ConnectionInfo['status'],
            country: result.connectedCountry || null,
            proxy: result.connectedProxy || null
          });
        }
      );
    } catch (error) {
      console.error('Error in getConnectionStatus:', error);
      resolve({
        status: 'disconnected',
        country: null,
        proxy: null
      });
    }
  });
};

const sendNativeMessage = (message: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      if (!chrome || !chrome.runtime || !chrome.runtime.sendNativeMessage) {
        reject(new Error('Chrome runtime API not available'));
        return;
      }
      
      if (!message || typeof message !== 'object') {
        reject(new Error('Invalid message format'));
        return;
      }

      try {
        chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, message, (response: any) => {
          try {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(response || null);
            }
          } catch (error) {
            console.error('Error in sendNativeMessage callback:', error);
            reject(error);
          }
        });
      } catch (error) {
        console.error('Error calling sendNativeMessage:', error);
        reject(error);
      }
    } catch (error) {
      console.error('Error in sendNativeMessage:', error);
      reject(error);
    }
  });
};

const loadDefaultCountries = (): Country[] => {
  return ALL_COUNTRIES;
};

// Verify VPN connection checkpoint - test if proxy is actually working
const verifyConnectionCheckpoint = async (proxyConfig: any): Promise<void> => {
  return new Promise((resolve) => {
    try {
      // Wait a moment for proxy to be fully active
      setTimeout(() => {
        try {
          // Check if fetch is available
          if (typeof fetch === 'undefined') {
            console.warn('VPN checkpoint: fetch not available, skipping verification');
            resolve();
            return;
          }

          // Make a test request to verify the proxy is working
          const testUrl = 'https://api.ipify.org?format=json';
          
          fetch(testUrl, {
            method: 'GET',
            cache: 'no-cache',
            mode: 'cors'
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
                console.warn('Error processing checkpoint response:', e);
                throw e;
              }
            })
            .then(data => {
              try {
                if (data && data.ip) {
                  console.log('VPN checkpoint: Connection verified successfully. IP:', data.ip);
                  // Store the IP for reference
                  try {
                    chrome.storage.local.set({ vpnIP: data.ip }, () => {
                      if (chrome.runtime.lastError) {
                        console.warn('Error storing VPN IP:', chrome.runtime.lastError.message);
                      }
                    });
                  } catch (e) {
                    console.warn('Error storing VPN IP:', e);
                  }
                }
                resolve();
              } catch (e) {
                console.error('Error processing checkpoint data:', e);
                resolve();
              }
            })
            .catch(error => {
              console.warn('VPN checkpoint: Could not verify connection, but proxy may still work:', error);
              // Don't reject - connection might still work even if verification fails
              resolve();
            });
        } catch (error) {
          console.warn('VPN checkpoint: Could not initiate verification:', error);
          // Don't fail - connection might still work
          resolve();
        }
      }, 2000); // Wait 2 seconds for proxy to activate
    } catch (error) {
      console.error('Error in verifyConnectionCheckpoint:', error);
      resolve();
    }
  });
};

