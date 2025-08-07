import type { Type } from './typings'
import { isBrowser, isNode } from './environment'
import { browserStylesMap } from './browser-styles'
import { safeConsoleLog } from './console-utils'

// Re-export environment detection for backward compatibility
export { isBrowser, isNode } from './environment'
export { processBrowserText } from './text-processor'

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

// Browser-compatible styling function
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

// Browser-compatible console logging
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
