import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/popup.css';

// Helper function to safely handle errors
function safeError(error: unknown): Error {
  let safeErr: Error;
  
  if (error instanceof Error) {
    safeErr = error;
  } else if (typeof error === 'string') {
    safeErr = new Error(error);
  } else if (error && typeof error === 'object' && 'message' in error) {
    safeErr = new Error(String(error.message));
  } else {
    safeErr = new Error('An unknown error occurred');
  }
  
  // Ensure error has a stack trace
  if (!safeErr.stack) {
    try {
      throw safeErr;
    } catch (e) {
      // Stack trace will be generated
    }
  }
  
  return safeErr;
}

// Ensure root element exists before rendering
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found');
  document.body.innerHTML = '<div style="padding: 20px; font-family: Arial;"><h2>Error</h2><p>Root element not found. Please reload the extension.</p></div>';
} else {
  try {
    // Check if ReactDOM is available
    if (!ReactDOM || !ReactDOM.createRoot) {
      throw new Error('ReactDOM.createRoot is not available');
    }
    
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    const safeErr = safeError(error);
    console.error('Failed to render app:', safeErr);
    
    // Display user-friendly error message
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial; text-align: center;">
        <h2 style="color: #dc2626;">Error</h2>
        <p>Failed to initialize the extension.</p>
        <p style="font-size: 0.9em; color: #6b7280;">${safeErr.message}</p>
        <button 
          onclick="window.location.reload()" 
          style="margin-top: 15px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;"
        >
          Reload Extension
        </button>
      </div>
    `;
  }
}

