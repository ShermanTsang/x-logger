/**
 * Safe console logging utilities with error handling
 */

/**
 * Safe console logging with error handling
 * Silently ignores any errors that might occur during logging
 */
export function safeConsoleLog(...args: any[]): void {
  try {
    if (typeof console !== 'undefined' && console && typeof console.log === 'function') {
      console.log(...args)
    }
    // Silently ignore if console or console.log is not available
  }
  catch (error) {
    // Silently ignore any errors that might occur during logging
  }
}
