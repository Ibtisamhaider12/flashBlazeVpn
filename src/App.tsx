import React, { useState, useEffect } from 'react';
import CountrySelector from './components/CountrySelector';
import ConnectionStatus from './components/ConnectionStatus';
import { getCountries, connectVPN, disconnectVPN, getConnectionStatus } from './utils/vpnService';
import type { Country, ConnectionStatus as ConnStatus } from './types';

const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnStatus>('disconnected');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCountries();
    
    // Periodically check connection status to keep UI in sync
    const statusInterval = setInterval(() => {
      checkConnectionStatus();
    }, 10000); // Check every 10 seconds
    
    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  // Separate effect to check connection status after countries are loaded
  useEffect(() => {
    if (countries.length > 0) {
      checkConnectionStatus();
    }
  }, [countries.length]);

  const loadCountries = async () => {
    try {
      const countryList = await getCountries();
      setCountries(countryList);
      // Check connection status after countries are loaded
      const status = await getConnectionStatus();
      setConnectionStatus(status.status);
      if (status.country && countryList.length > 0) {
        const country = countryList.find(c => c.code === status.country);
        if (country) setSelectedCountry(country);
      }
    } catch (error) {
      console.error('Failed to load countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const status = await getConnectionStatus();
      setConnectionStatus(status.status);
      if (status.country && countries.length > 0) {
        const country = countries.find(c => c.code === status.country);
        if (country) {
          setSelectedCountry(country);
        } else {
          // Country not found in current list, clear selection
          setSelectedCountry(null);
        }
      } else if (!status.country) {
        setSelectedCountry(null);
      }
    } catch (error) {
      console.error('Failed to check connection status:', error);
      // Don't update state on error to avoid UI flicker
    }
  };

  const handleConnect = async (country: Country) => {
    if (!country || !country.code) {
      console.error('Invalid country provided');
      return;
    }
    
    try {
      setConnectionStatus('connecting');
      await connectVPN(country);
      setSelectedCountry(country);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectionStatus('disconnected');
      // Use setTimeout to avoid blocking the UI thread
      setTimeout(() => {
        alert('Failed to connect. Please check the native host is installed.');
      }, 0);
    }
  };

  const handleDisconnect = async () => {
    try {
      setConnectionStatus('disconnecting');
      await disconnectVPN();
      setSelectedCountry(null);
      setConnectionStatus('disconnected');
    } catch (error) {
      console.error('Failed to disconnect:', error);
      // Always set to disconnected even on error
      setConnectionStatus('disconnected');
      setSelectedCountry(null);
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
          countries={countries}
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
};

export default App;

