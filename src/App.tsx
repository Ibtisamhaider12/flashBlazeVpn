import React, { useState, useEffect } from 'react';
import CountrySelector from './components/CountrySelector';
import ConnectionStatus from './components/ConnectionStatus';
import { getCountries, connectVPN, disconnectVPN, getConnectionStatus } from './utils/vpnService';
import { safeStateUpdate, safeAsync, normalizeError } from './utils/errorHandler';
import type { Country, ConnectionStatus as ConnStatus } from './types';

const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnStatus>('disconnected');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      loadCountries();
      
      // Periodically check connection status to keep UI in sync
      const statusInterval = setInterval(() => {
        try {
          checkConnectionStatus();
        } catch (error) {
          console.error('Error in status check interval:', error);
        }
      }, 10000); // Check every 10 seconds
      
      return () => {
        try {
          clearInterval(statusInterval);
        } catch (error) {
          console.error('Error clearing interval:', error);
        }
      };
    } catch (error) {
      console.error('Error in useEffect:', error);
      setLoading(false);
    }
  }, []);

  // Separate effect to check connection status after countries are loaded
  useEffect(() => {
    try {
      if (Array.isArray(countries) && countries.length > 0) {
        checkConnectionStatus();
      }
    } catch (error) {
      console.error('Error in countries length effect:', error);
    }
  }, [countries.length]);

  const loadCountries = async () => {
    try {
      const countryList = await safeAsync(
        () => getCountries(),
        [],
        (error) => console.error('Failed to load countries:', error)
      );
      
      if (Array.isArray(countryList) && countryList.length > 0) {
        safeStateUpdate(setCountries, countryList);
        
        // Check connection status after countries are loaded
        const status = await safeAsync(
          () => getConnectionStatus(),
          { status: 'disconnected' as ConnStatus, country: null, proxy: null },
          (error) => console.warn('Error getting connection status:', error)
        );
        
        if (status && typeof status === 'object') {
          safeStateUpdate(setConnectionStatus, status.status || 'disconnected');
          
          if (status.country && countryList.length > 0) {
            try {
              const country = countryList.find(c => c && c && typeof c === 'object' && c.code === status.country);
              if (country) {
                safeStateUpdate(setSelectedCountry, country);
              }
            } catch (e) {
              console.warn('Error finding country:', normalizeError(e));
            }
          }
        }
      } else {
        console.warn('Invalid or empty countries list received');
        safeStateUpdate(setCountries, []);
      }
    } catch (error) {
      console.error('Failed to load countries:', normalizeError(error));
      safeStateUpdate(setCountries, []);
    } finally {
      safeStateUpdate(setLoading, false);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const status = await safeAsync(
        () => getConnectionStatus(),
        { status: 'disconnected' as ConnStatus, country: null, proxy: null },
        (error) => console.error('Failed to check connection status:', error)
      );
      
      if (status && typeof status === 'object') {
        safeStateUpdate(setConnectionStatus, status.status || 'disconnected');
        
        if (status.country && Array.isArray(countries) && countries.length > 0) {
          try {
            const country = countries.find(c => c && typeof c === 'object' && c.code === status.country);
            if (country) {
              safeStateUpdate(setSelectedCountry, country);
            } else {
              safeStateUpdate(setSelectedCountry, null);
            }
          } catch (e) {
            console.warn('Error finding country in checkConnectionStatus:', normalizeError(e));
            safeStateUpdate(setSelectedCountry, null);
          }
        } else if (!status.country) {
          safeStateUpdate(setSelectedCountry, null);
        }
      }
    } catch (error) {
      // Error already logged by safeAsync
      // Don't update state on error to avoid UI flicker
    }
  };

  const handleConnect = async (country: Country) => {
    try {
      if (!country || typeof country !== 'object' || !country.code) {
        console.error('Invalid country provided');
        return;
      }
      
      safeStateUpdate(setConnectionStatus, 'connecting');
      
      const result = await safeAsync(
        () => connectVPN(country),
        undefined,
        (error) => {
          console.error('Failed to connect:', error);
          safeStateUpdate(setConnectionStatus, 'disconnected');
          
          // Use setTimeout to avoid blocking the UI thread
          setTimeout(() => {
            try {
              alert(`Failed to connect: ${error.message}. Please check the native host is installed.`);
            } catch (e) {
              console.error('Error showing alert:', normalizeError(e));
            }
          }, 0);
        }
      );
      
      if (result !== undefined) {
        safeStateUpdate(setSelectedCountry, country);
        safeStateUpdate(setConnectionStatus, 'connected');
      }
    } catch (error) {
      console.error('Error in handleConnect:', normalizeError(error));
      safeStateUpdate(setConnectionStatus, 'disconnected');
    }
  };

  const handleDisconnect = async () => {
    try {
      safeStateUpdate(setConnectionStatus, 'disconnecting');
      
      await safeAsync(
        () => disconnectVPN(),
        undefined,
        (error) => console.error('Failed to disconnect:', error)
      );
      
      // Always set to disconnected even on error
      safeStateUpdate(setSelectedCountry, null);
      safeStateUpdate(setConnectionStatus, 'disconnected');
    } catch (error) {
      console.error('Error in handleDisconnect:', normalizeError(error));
      safeStateUpdate(setConnectionStatus, 'disconnected');
      safeStateUpdate(setSelectedCountry, null);
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading countries...</p>
      </div>
    );
  }

  try {
    return (
      <div className="app">
        <header className="app-header">
          <h1>FlashBlaze VPN</h1>
          <ConnectionStatus 
            status={connectionStatus}
            country={selectedCountry}
          />
        </header>
        <main className="app-main">
          <CountrySelector
            countries={Array.isArray(countries) ? countries : []}
            selectedCountry={selectedCountry}
            onSelect={handleConnect}
            disabled={connectionStatus === 'connecting' || connectionStatus === 'disconnecting'}
          />
          {connectionStatus === 'connected' && (
            <button 
              className="btn-disconnect"
              onClick={handleDisconnect}
              disabled={connectionStatus === 'disconnecting'}
            >
              Disconnect
            </button>
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error rendering App:', error);
    return (
      <div className="app">
        <header className="app-header">
          <h1>FlashBlaze VPN</h1>
        </header>
        <main className="app-main">
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>An error occurred. Please reload the extension.</p>
            <button onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </main>
      </div>
    );
  }
};

export default App;

