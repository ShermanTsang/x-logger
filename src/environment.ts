/**
 * Environment detection utilities for cross-platform compatibility
 */

/**
 * Detects if the current environment is a browser
 */
export const isBrowser
  = typeof globalThis !== 'undefined'
  && typeof (globalThis as any).window !== 'undefined'
  && typeof (globalThis as any).document !== 'undefined'

/**
 * Detects if the current environment is Node.js
 */
export const isNode
  = typeof globalThis !== 'undefined'
  && typeof (globalThis as any).process !== 'undefined'
  && (globalThis as any).process?.versions?.node
  && !isBrowser
