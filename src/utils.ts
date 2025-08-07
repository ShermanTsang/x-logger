/**
 * Consolidated utility functions for Sherman Logger
 * Combines functionality from utils, console-utils, text-processor, and adapter
 */

import type { Type } from './typings'
import { isBrowser, isNode } from './environment'

/**
 * Maps style names to CSS properties for browser console styling
 */
const browserStylesMap: Record<string, string> = {
  // Colors
  black: 'color: #000000',
  red: 'color: #ff0000',
  green: 'color: #008000',
  yellow: 'color: #ffff00',
  blue: 'color: #0000ff',
  magenta: 'color: #ff00ff',
  cyan: 'color: #00ffff',
  white: 'color: #ffffff',
  gray: 'color: #808080',
  grey: 'color: #808080',

  // Bright colors
  redBright: 'color: #ff5555',
  greenBright: 'color: #55ff55',
  yellowBright: 'color: #ffff55',
  blueBright: 'color: #5555ff',
  magentaBright: 'color: #ff55ff',
  cyanBright: 'color: #55ffff',
  whiteBright: 'color: #ffffff',

  // Background colors
  bgBlack: 'background-color: #000000; color: #ffffff',
  bgRed: 'background-color: #ff0000; color: #ffffff',
  bgGreen: 'background-color: #008000; color: #ffffff',
  bgYellow: 'background-color: #ffff00; color: #000000',
  bgBlue: 'background-color: #0000ff; color: #ffffff',
  bgMagenta: 'background-color: #ff00ff; color: #ffffff',
  bgCyan: 'background-color: #00ffff; color: #000000',
  bgWhite: 'background-color: #ffffff; color: #000000',

  // Bright background colors
  bgRedBright:
    'background-color: #ff5555; color: #ffffff; padding: 2px 4px; border-radius: 3px',
  bgGreenBright:
    'background-color: #55ff55; color: #000000; padding: 2px 4px; border-radius: 3px',
  bgYellowBright:
    'background-color: #ffff55; color: #000000; padding: 2px 4px; border-radius: 3px',
  bgBlueBright:
    'background-color: #5555ff; color: #ffffff; padding: 2px 4px; border-radius: 3px',
  bgMagentaBright:
    'background-color: #ff55ff; color: #ffffff; padding: 2px 4px; border-radius: 3px',
  bgCyanBright:
    'background-color: #55ffff; color: #000000; padding: 2px 4px; border-radius: 3px',
  bgWhiteBright:
    'background-color: #ffffff; color: #000000; padding: 2px 4px; border-radius: 3px',

  // Text decorations
  bold: 'font-weight: bold',
  dim: 'opacity: 0.5',
  italic: 'font-style: italic',
  underline: 'text-decoration: underline',
  strikethrough: 'text-decoration: line-through',
}

// =============================================================================
// SLEEP UTILITY
// =============================================================================

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// =============================================================================
// CONSOLE UTILITIES
// =============================================================================

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

// =============================================================================
// TEXT PROCESSING UTILITIES
// =============================================================================

/**
 * Enhanced browser console styling for special patterns
 * Handles [[text]] pattern for browser highlighting
 */
export function processBrowserText(text: string): {
  text: string
  styles?: string
} {
  if (isBrowser) {
    // Handle [[text]] pattern for browser
    const processedText = text.replace(/\[\[(.+?)\]\]/g, '$1')
    const hasHighlight = text.includes('[[')

    if (hasHighlight) {
      return {
        text: processedText,
        styles: 'text-decoration: underline; color: #ffff00; font-weight: bold',
      }
    }
  }

  return { text }
}

// =============================================================================
// CHALK ADAPTER (Node.js specific)
// =============================================================================

// Lazy-loaded chalk for Node.js environments
let chalkInstance: any = null

/**
 * Lazily loads and returns the chalk instance for Node.js environments
 */
export async function getChalk() {
  // eslint-disable-next-line node/prefer-global/process
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'browser' && !chalkInstance && isNode && !isBrowser) {
    try {
      // Only import chalk in Node.js environments, not in browser builds
      const chalkModule = await import('chalk')
      chalkInstance = chalkModule.default
    }
    catch (error) {
      // Silently fail in browser environments or when chalk is not available
      if (isNode) {
        safeConsoleLog('Failed to load chalk:', error)
      }
    }
  }
  return chalkInstance
}

/**
 * Gets the current chalk instance (may be null if not loaded)
 */
export function getChalkInstance() {
  return chalkInstance
}

// Initialize chalk for Node.js environments only
if (isNode && !isBrowser) {
  getChalk()
}

// =============================================================================
// CROSS-PLATFORM STYLING
// =============================================================================

/**
 * Browser-compatible styling function
 */
export function getStyledText(
  styles: Type.Styles = [],
  text: string,
): { text: string, styles?: string } {
  if (isBrowser) {
    // Browser environment - return CSS styles for console.log
    const cssStyles = styles
      .map(style => browserStylesMap[style])
      .filter(Boolean)
      .join('; ')

    return {
      text,
      styles: cssStyles || undefined,
    }
  }
  else {
    // Node.js environment - use chalk if available
    const chalkInstance = getChalkInstance()
    if (chalkInstance) {
      const styledText = styles.reduce((accumulator, chalkStyleDescriptor) => {
        if (chalkStyleDescriptor in chalkInstance) {
          return chalkInstance[chalkStyleDescriptor](accumulator)
        }
        return accumulator
      }, text)
      return { text: styledText }
    }

    // Fallback for Node.js without chalk
    return { text }
  }
}

/**
 * Browser-compatible console logging with styling
 */
export function logWithStyle(message: string, styles?: Type.Styles) {
  if (isBrowser && styles && styles.length > 0) {
    const { text, styles: cssStyles } = getStyledText(styles, message)
    if (cssStyles) {
      safeConsoleLog(`%c${text}`, cssStyles)
    }
    else {
      safeConsoleLog(text)
    }
  }
  else if (!isBrowser) {
    // Node.js with chalk
    const { text } = getStyledText(styles, message)
    safeConsoleLog(text)
  }
  else {
    // Fallback - plain text
    safeConsoleLog(message)
  }
}

// =============================================================================
// NAVIGATOR UTILITIES (Browser specific)
// =============================================================================

// Type definitions for storage API
interface StorageEstimate {
  quota?: number
  usage?: number
}

interface NavigatorStorage {
  estimate: () => Promise<StorageEstimate>
}

/**
 * Safe navigator access for environments where navigator might be undefined
 * (e.g., some server-side rendering contexts)
 */
export const safeNavigator = {
  /**
   * Safely get user agent string
   * @returns User agent string or fallback value
   */
  getUserAgent(): string {
    try {
      const userAgent = safeNavigator.safeNavigatorProperty<string>('userAgent')
      return userAgent && typeof userAgent === 'string' ? userAgent : 'Unknown UserAgent'
    }
    catch {
      return 'Unknown UserAgent'
    }
  },

  /**
   * Safely check if storage API is available
   * @returns boolean indicating if storage.estimate is available
   */
  hasStorageAPI(): boolean {
    try {
      const storage = safeNavigator.safeNavigatorProperty<NavigatorStorage>('storage')
      return storage !== null
        && typeof storage === 'object'
        && typeof storage.estimate === 'function'
    }
    catch {
      return false
    }
  },

  /**
   * Safely get storage estimate
   * @returns Storage estimate or null if not available
   */
  async getStorageEstimate(): Promise<StorageEstimate | null> {
    try {
      if (safeNavigator.hasStorageAPI()) {
        const storage = safeNavigator.safeNavigatorProperty<NavigatorStorage>('storage')
        if (storage && typeof storage.estimate === 'function') {
          return await storage.estimate()
        }
      }
      return null
    }
    catch {
      return null
    }
  },

  /**
   * Safely check if navigator is available
   * @returns boolean indicating if navigator object exists
   */
  isAvailable(): boolean {
    try {
      return typeof navigator !== 'undefined' && navigator !== null
    }
    catch {
      return false
    }
  },

  /**
   * Safely access navigator properties to prevent userAgentData or other property access errors
   * @param property - The navigator property to access
   * @returns The property value or null if not available
   */
  safeNavigatorProperty<T = any>(property: string): T | null {
    try {
      if (!safeNavigator.isAvailable()) {
        return null
      }

      // Use Object.prototype.hasOwnProperty for safe property checking
      if (Object.prototype.hasOwnProperty.call(navigator, property)) {
        return (navigator as any)[property]
      }

      return null
    }
    catch {
      return null
    }
  },

  /**
   * Get enhanced user agent string
   * @returns User agent string
   */
  getEnhancedUserAgent(): string {
    try {
      return safeNavigator.getUserAgent()
    }
    catch {
      return safeNavigator.getUserAgent()
    }
  },

  /**
   * Safely detect if running on mobile device
   * @returns boolean indicating if on mobile device
   */
  isMobile(): boolean {
    try {
      const userAgent = safeNavigator.getUserAgent()
      if (userAgent === 'Unknown UserAgent') {
        return false
      }
      return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(userAgent)
    }
    catch {
      return false
    }
  },

  /**
   * Get environment information
   * @returns Environment information object
   */
  getEnvironmentInfo(): {
    isNavigatorAvailable: boolean
    hasStorageAPI: boolean
    isMobile: boolean
    userAgent: string
  } {
    return {
      isNavigatorAvailable: safeNavigator.isAvailable(),
      hasStorageAPI: safeNavigator.hasStorageAPI(),
      isMobile: safeNavigator.isMobile(),
      userAgent: safeNavigator.getEnhancedUserAgent(),
    }
  },
}
