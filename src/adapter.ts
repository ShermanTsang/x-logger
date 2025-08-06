import type { Type } from './typings'

// Environment detection
export const isBrowser
  = typeof globalThis !== 'undefined'
  && typeof (globalThis as any).window !== 'undefined'
  && typeof (globalThis as any).document !== 'undefined'

export const isNode
  = typeof globalThis !== 'undefined'
  && typeof (globalThis as any).process !== 'undefined'
  && (globalThis as any).process?.versions?.node
  && !isBrowser

// Browser console styling map
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

// Lazy-loaded chalk for Node.js environments
let chalkInstance: any = null

async function getChalk() {
  if (!chalkInstance && isNode && !isBrowser) {
    try {
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

// Safe console logging with error handling
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
  else if (!isBrowser && chalkInstance) {
    // Node.js with chalk
    const { text } = getStyledText(styles, message)
    safeConsoleLog(text)
  }
  else {
    // Fallback - plain text
    safeConsoleLog(message)
  }
}

// Initialize chalk for Node.js environments only
if (isNode && !isBrowser) {
  getChalk()
}

// Enhanced browser console styling for special patterns
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
