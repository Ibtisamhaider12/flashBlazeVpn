import React, { Component, ErrorInfo, ReactNode } from 'react';
import { normalizeError } from '../utils/errorHandler';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: unknown): State {
    // Use the centralized error normalization
    const normalizedError = normalizeError(error);
    return { hasError: true, error: normalizedError, errorInfo: null };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    // Use the centralized error normalization
    const safeError = normalizeError(error);
    
    console.error('ErrorBoundary caught an error:', safeError, errorInfo);
    
    // Safe state update
    try {
      this.setState({
        error: safeError,
        errorInfo: errorInfo
      });
    } catch (setStateError) {
      // Even setState can fail, so we catch it
      console.error('Error setting state in ErrorBoundary:', normalizeError(setStateError));
    }
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected error occurred';
      
      return (
        <div className="app-error">
          <h2>Something went wrong</h2>
          <p>{errorMessage}</p>
          <button onClick={this.handleReload}>
            Reload Extension
          </button>
          {this.state.error && process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
              <summary>Error Details (Development Only)</summary>
              <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                {this.state.error.stack || String(this.state.error)}
              </pre>
              {this.state.errorInfo && (
                <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

