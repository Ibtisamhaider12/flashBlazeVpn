import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { normalizeError } from './utils/errorHandler';
import './styles/popup.css';

// Global error handlers for unhandled errors
// These must be set up before any React code runs
window.addEventListener('error', (event) => {
  try {
    const error = normalizeError(event.error);
    console.error('Global error caught:', error);
    // Prevent default error handling to avoid React's error processing
    event.preventDefault();
    event.stopPropagation();
    return false;
  } catch (e) {
    // Even error handling can fail, so we catch it
    console.error('Error in global error handler:', e);
    return false;
  }
}, true); // Use capture phase

window.addEventListener('unhandledrejection', (event) => {
  try {
    const error = normalizeError(event.reason);
    console.error('Unhandled promise rejection:', error);
    // Prevent default to avoid React processing
    event.preventDefault();
  } catch (e) {
    console.error('Error in unhandled rejection handler:', e);
  }
});

// Ensure root element exists before rendering
const rootElement = document.getElementById('root');
if (!rootElement) {
  try {
    console.error('Root element not found');
    if (document.body) {
      document.body.innerHTML = '<div style="padding: 20px; font-family: Arial;"><h2>Error</h2><p>Root element not found. Please reload the extension.</p></div>';
    }
  } catch (e) {
    console.error('Error displaying root element error:', e);
  }
} else {
  try {
    // Check if React and ReactDOM are available
    if (!React) {
      throw new Error('React is not available');
    }
    if (!ReactDOM || !ReactDOM.createRoot) {
      throw new Error('ReactDOM.createRoot is not available');
    }
    
    const root = ReactDOM.createRoot(rootElement);
    
    // Wrap render in try-catch to handle any synchronous errors
    // Remove StrictMode to avoid double-rendering and error issues
    try {
      root.render(
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      );
    } catch (renderError) {
      // If render throws synchronously, handle it
      const safeErr = normalizeError(renderError);
      console.error('Error during React render:', safeErr);
      throw safeErr;
    }
  } catch (error) {
    try {
      const safeErr = normalizeError(error);
      console.error('Failed to render app:', safeErr);
      
      // Display user-friendly error message
      if (rootElement) {
        const errorMessage = safeErr.message || 'Unknown error';
        // Escape HTML to prevent XSS
        const escapedMessage = errorMessage
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
        
        rootElement.innerHTML = `
          <div style="padding: 20px; font-family: Arial; text-align: center;">
            <h2 style="color: #dc2626;">Error</h2>
            <p>Failed to initialize the extension.</p>
            <p style="font-size: 0.9em; color: #6b7280;">${escapedMessage}</p>
            <button 
              onclick="window.location.reload()" 
              style="margin-top: 15px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;"
            >
              Reload Extension
            </button>
          </div>
        `;
      }
    } catch (e) {
      console.error('Error displaying error message:', e);
    }
  }
}

