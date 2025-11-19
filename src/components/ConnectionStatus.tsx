import React from 'react';
import type { ConnectionStatus as ConnStatus, Country } from '../types';

interface ConnectionStatusProps {
  status: ConnStatus;
  country: Country | null;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status, country }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return '#10b981';
      case 'connecting':
      case 'disconnecting':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnecting':
        return 'Disconnecting...';
      default:
        return 'Disconnected';
    }
  };

  return (
    <div className="connection-status">
      <div className="status-indicator" style={{ backgroundColor: getStatusColor() }}></div>
      <div className="status-info">
        <span className="status-text">{getStatusText()}</span>
        {country && status === 'connected' && (
          <span className="country-info">
            {country.flag} {country.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;

