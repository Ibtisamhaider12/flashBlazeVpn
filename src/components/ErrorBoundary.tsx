import React, { Component, ErrorInfo, ReactNode } from 'react';

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
    // Normalize error to ensure it's always an Error object
    let normalizedError: Error;
    
    if (error instanceof Error) {
      normalizedError = error;
    } else if (typeof error === 'string') {
      normalizedError = new Error(error);
    } else if (error && typeof error === 'object' && 'message' in error) {
      normalizedError = new Error(String(error.message));
    } else {
      normalizedError = new Error('An unknown error occurred');
    }
    
    return { hasError: true, error: normalizedError, errorInfo: null };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    // Normalize error to ensure it's always an Error object
    let safeError: Error;
    
    if (error instanceof Error) {
      safeError = error;
    } else if (typeof error === 'string') {
      safeError = new Error(error);
    } else if (error && typeof error === 'object' && 'message' in error) {
      safeError = new Error(String(error.message));
    } else {
      safeError = new Error('An unknown error occurred');
    }
    
    // Ensure error has a stack trace
    if (!safeError.stack) {
      try {
        throw safeError;
      } catch (e) {
        // Stack trace will be generated
      }
    }
    
    console.error('ErrorBoundary caught an error:', safeError, errorInfo);
    
    this.setState({
      error: safeError,
      errorInfo: errorInfo
    });
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

