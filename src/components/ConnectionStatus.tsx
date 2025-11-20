import React from 'react';
import type { ConnectionStatus as ConnStatus, Country } from '../types';
import { normalizeError } from '../utils/errorHandler';

interface ConnectionStatusProps {
  status: ConnStatus;
  country: Country | null;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status, country }) => {
  const getStatusColor = (): string => {
    try {
      switch (status) {
        case 'connected':
          return '#10b981';
        case 'connecting':
        case 'disconnecting':
          return '#f59e0b';
        default:
          return '#6b7280';
      }
    } catch (error) {
      console.error('Error in getStatusColor:', normalizeError(error));
      return '#6b7280';
    }
  };

  const getStatusText = (): string => {
    try {
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
    } catch (error) {
      console.error('Error in getStatusText:', normalizeError(error));
      return 'Disconnected';
    }
  };

  try {
    return (
      <div className="connection-status">
        <div className="status-indicator" style={{ backgroundColor: getStatusColor() }}></div>
        <div className="status-info">
          <span className="status-text">{getStatusText()}</span>
          {country && status === 'connected' && (
            <span className="country-info">
              {country.flag || ''} {country.name || ''}
            </span>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering ConnectionStatus:', normalizeError(error));
    return (
      <div className="connection-status">
        <div className="status-indicator" style={{ backgroundColor: '#6b7280' }}></div>
        <div className="status-info">
          <span className="status-text">Error</span>
        </div>
      </div>
    );
  }
};

export default ConnectionStatus;

