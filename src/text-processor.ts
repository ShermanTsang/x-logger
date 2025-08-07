/**
 * Text processing utilities for enhanced console output
 */

import { isBrowser } from './environment'

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
