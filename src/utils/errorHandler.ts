/**
 * Comprehensive error handling utilities
 * Ensures all errors are properly normalized before React sees them
 */

export function normalizeError(error: unknown): Error {
  // If it's already an Error with proper properties, return it
  if (error instanceof Error) {
    // Ensure it has a message
    if (!error.message) {
      error.message = 'An unknown error occurred';
    }
    // Ensure it has a stack
    if (!error.stack) {
      try {
        throw error;
      } catch {
        // Stack will be generated
      }
    }
    return error;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    const err = new Error(error);
    try {
      throw err;
    } catch {
      // Stack will be generated
    }
    return err;
  }
  
  // Handle object errors
  if (error && typeof error === 'object') {
    const message = 'message' in error && typeof error.message === 'string'
      ? error.message
      : 'error' in error && typeof error.error === 'string'
        ? error.error
        : String(error);
    
    const err = new Error(message);
    try {
      throw err;
    } catch {
      // Stack will be generated
    }
    return err;
  }
  
  // Fallback for unknown types
  const err = new Error('An unknown error occurred');
  try {
    throw err;
  } catch {
    // Stack will be generated
  }
  return err;
}

/**
 * Safe wrapper for React state updates
 * Prevents errors from breaking React's rendering
 */
export function safeStateUpdate<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  value: T | ((prev: T) => T),
  errorHandler?: (error: unknown) => void
): void {
  try {
    if (typeof value === 'function') {
      setState((prev) => {
        try {
          return (value as (prev: T) => T)(prev);
        } catch (error) {
          const normalized = normalizeError(error);
          if (errorHandler) {
            errorHandler(normalized);
          } else {
            console.error('Error in state update function:', normalized);
          }
          return prev; // Return previous state on error
        }
      });
    } else {
      setState(value);
    }
  } catch (error) {
    const normalized = normalizeError(error);
    if (errorHandler) {
      errorHandler(normalized);
    } else {
      console.error('Error in state update:', normalized);
    }
  }
}

/**
 * Safe async wrapper
 * Ensures all promise rejections are properly handled
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  errorHandler?: (error: Error) => void
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const normalized = normalizeError(error);
    if (errorHandler) {
      errorHandler(normalized);
    } else {
      console.error('Error in async operation:', normalized);
    }
    return fallback;
  }
}

/**
 * Safe callback wrapper
 * Prevents errors in callbacks from breaking the app
 */
export function safeCallback<T extends (...args: any[]) => any>(
  fn: T,
  errorHandler?: (error: Error) => void
): T {
  return ((...args: Parameters<T>) => {
    try {
      return fn(...args);
    } catch (error) {
      const normalized = normalizeError(error);
      if (errorHandler) {
        errorHandler(normalized);
      } else {
        console.error('Error in callback:', normalized);
      }
      return undefined;
    }
  }) as T;
}

