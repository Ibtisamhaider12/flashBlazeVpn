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
    checkConnectionStatus();
  }, []);

  const loadCountries = async () => {
    try {
      const countryList = await getCountries();
      setCountries(countryList);
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
      if (status.country) {
        const country = countries.find(c => c.code === status.country);
        if (country) setSelectedCountry(country);
      }
    } catch (error) {
      console.error('Failed to check connection status:', error);
    }
  };

  const handleConnect = async (country: Country) => {
    try {
      setConnectionStatus('connecting');
      await connectVPN(country);
      setSelectedCountry(country);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectionStatus('disconnected');
      alert('Failed to connect. Please check the native host is installed.');
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
      setConnectionStatus('disconnected');
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

