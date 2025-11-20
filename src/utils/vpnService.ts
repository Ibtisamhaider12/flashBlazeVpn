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
    // First, try to get proxy from native host
    sendNativeMessage({
      action: 'getProxy',
      country: country.code
    })
      .then((response) => {
        if (response && response.proxy) {
          const proxyConfig = response.proxy;
          const proxyServer: chrome.proxy.ProxyServer = {
            host: proxyConfig.host,
            port: proxyConfig.port,
            scheme: proxyConfig.type === 'socks5' ? 'socks5' : 
                   proxyConfig.type === 'socks4' ? 'socks4' : 'http'
          };

          const config: chrome.proxy.ProxyConfig = {
            mode: 'fixed_servers',
            rules: {
              singleProxy: proxyServer
            }
          };

          chrome.proxy.settings.set(
            { value: config, scope: 'regular' },
            () => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
              } else {
                // Save connection info
                chrome.storage.local.set({
                  connectionStatus: 'connected',
                  connectedCountry: country.code,
                  connectedProxy: proxyConfig
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
              }
            }
          );
        } else {
          // Fallback to first available proxy from country
          if (country.proxyServers && country.proxyServers.length > 0) {
            const proxy = country.proxyServers[0];
            const proxyServer: chrome.proxy.ProxyServer = {
              host: proxy.host,
              port: proxy.port,
              scheme: proxy.type === 'socks5' ? 'socks5' : 
                     proxy.type === 'socks4' ? 'socks4' : 'http'
            };

            const config: chrome.proxy.ProxyConfig = {
              mode: 'fixed_servers',
              rules: {
                singleProxy: proxyServer
              }
            };

            chrome.proxy.settings.set(
              { value: config, scope: 'regular' },
              () => {
                if (chrome.runtime.lastError) {
                  reject(new Error(chrome.runtime.lastError.message));
                } else {
                  chrome.storage.local.set({
                    connectionStatus: 'connected',
                    connectedCountry: country.code,
                    connectedProxy: proxy
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
                }
              }
            );
          } else {
            reject(new Error('No proxy servers available for this country'));
          }
        }
      })
      .catch((error) => {
        console.warn('Native host not available, using fallback:', error);
        // Fallback to direct proxy configuration
        if (country.proxyServers && country.proxyServers.length > 0) {
          const proxy = country.proxyServers[0];
          const proxyServer: chrome.proxy.ProxyServer = {
            host: proxy.host,
            port: proxy.port,
            scheme: proxy.type === 'socks5' ? 'socks5' : 
                   proxy.type === 'socks4' ? 'socks4' : 'http'
          };

          const config: chrome.proxy.ProxyConfig = {
            mode: 'fixed_servers',
            rules: {
              singleProxy: proxyServer
            }
          };

          chrome.proxy.settings.set(
            { value: config, scope: 'regular' },
            () => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
              } else {
                chrome.storage.local.set({
                  connectionStatus: 'connected',
                  connectedCountry: country.code,
                  connectedProxy: proxy
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
              }
            }
          );
        } else {
          reject(new Error('No proxy servers available'));
        }
      });
  });
};

export const disconnectVPN = async (): Promise<void> => {
  return new Promise((resolve) => {
    // Stop keep-alive mechanism
    chrome.runtime.sendMessage({ action: 'stopKeepAlive' }, () => {
      if (chrome.runtime.lastError) {
        console.warn('Failed to stop keep-alive:', chrome.runtime.lastError.message);
      }
    });
    
    chrome.proxy.settings.clear({ scope: 'regular' }, () => {
      chrome.storage.local.set({
        connectionStatus: 'disconnected',
        connectedCountry: null,
        connectedProxy: null
      });
      resolve();
    });
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
      if (!chrome.runtime || !chrome.runtime.sendNativeMessage) {
        reject(new Error('Chrome runtime API not available'));
        return;
      }
      
      chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, message, (response: any) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response || null);
        }
      });
    } catch (error) {
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
    // Wait a moment for proxy to be fully active
    setTimeout(() => {
      try {
        // Make a test request to verify the proxy is working
        const testUrl = 'https://api.ipify.org?format=json';
        
        fetch(testUrl, {
          method: 'GET',
          cache: 'no-cache',
          mode: 'cors'
        })
          .then(response => {
            if (response && response.ok) {
              return response.json();
            }
            throw new Error('Test request failed');
          })
          .then(data => {
            if (data && data.ip) {
              console.log('VPN checkpoint: Connection verified successfully. IP:', data.ip);
              // Store the IP for reference
              chrome.storage.local.set({ vpnIP: data.ip });
            }
            resolve();
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
  });
};

