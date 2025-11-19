import type { Country, ConnectionInfo } from '../types';
import { ALL_COUNTRIES } from '../data/countries';

const NATIVE_HOST_NAME = 'com.flashblaze.vpn';

export const getCountries = async (): Promise<Country[]> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['countries'], (result: { [key: string]: any }) => {
      if (result.countries) {
        resolve(result.countries);
      } else {
        // Load default countries
        const defaultCountries = loadDefaultCountries();
        chrome.storage.local.set({ countries: defaultCountries });
        resolve(defaultCountries);
      }
    });
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
                resolve();
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
                  resolve();
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
                resolve();
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
    chrome.storage.local.get(
      ['connectionStatus', 'connectedCountry', 'connectedProxy'],
      (result: { [key: string]: any }) => {
        resolve({
          status: (result.connectionStatus || 'disconnected') as ConnectionInfo['status'],
          country: result.connectedCountry,
          proxy: result.connectedProxy
        });
      }
    );
  });
};

const sendNativeMessage = (message: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendNativeMessage(NATIVE_HOST_NAME, message, (response: any) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
};

const loadDefaultCountries = (): Country[] => {
  return ALL_COUNTRIES;
};

