/**
 * Browser Logger - Browser-specific logger implementation with CSS styling
 */

import type { Type } from './typings'
import { BaseLogger, BaseStreamLogger } from './base-logger'
import { browserStylesMap } from './browser-styles'
import { safeConsoleLog } from './console-utils'

/**
 * Browser-specific logger implementation with CSS styling support
 */
export class BrowserLogger extends BaseLogger {
  constructor(prefixStyles?: Type.Styles) {
    super(prefixStyles)
  }

  static getLoggerInstance(type: Type.Type, styles?: Type.Styles) {
    styles && (BrowserLogger.stylesMap[type] = styles)
    return new this(BrowserLogger.stylesMap[type])
  }

  static type(type: Type.Type, styles?: Type.Styles) {
    if (type in BrowserLogger && styles) {
      safeConsoleLog(
        `%cLogger type "${String(type)}" is preset. Add custom getter will override the preset.`,
        'color: #ffff00; text-decoration: underline',
      )
    }
    if (styles) {
      BrowserLogger.stylesMap[type] = styles
      // Track registered custom types
      if (!BrowserLogger.registeredTypes.includes(String(type))) {
        BrowserLogger.registeredTypes.push(String(type))
      }
    }
    const loggerInstance = BrowserLogger.getLoggerInstance(type, styles)
    Object.defineProperty(BrowserLogger, type, {
      get() {
        return loggerInstance
      },
      configurable: true,
      enumerable: true,
    })
    return loggerInstance
  }

  static get stream() {
    return new BrowserStreamLogger()
  }

  static get plain() {
    return this.getLoggerInstance('plain')
  }

  static get info() {
    return this.getLoggerInstance('info')
  }

  static get warn() {
    return this.getLoggerInstance('warn')
  }

  static get error() {
    return this.getLoggerInstance('error')
  }

  static get debug() {
    return this.getLoggerInstance('debug')
  }

  static get success() {
    return this.getLoggerInstance('success')
  }

  static get failure() {
    return this.getLoggerInstance('failure')
  }

  toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger {
    const streamLogger = new BrowserStreamLogger(prefix, prefixStyles)
    if (this._text) {
      streamLogger.text(this._text, this._textStyles)
    }
    if (this._detail) {
      streamLogger.detail(this._detail, this._detailStyles)
    }
    if (this._data) {
      streamLogger.data(this._data)
    }
    return streamLogger
  }

  decorateText(content: string, styles?: Type.Styles): string {
    let formattedContent = content || ''
    if (formattedContent) {
      // Browser environment - handle [[text]] pattern differently
      formattedContent = formattedContent.replace(/\[\[(.+?)\]\]/g, '$1')
    }
    return this.getStyledText(styles, formattedContent).text
  }

  printOutput(output: string): void {
    if (!output)
      return

    // Check if output contains styled elements
    const hasHighlight = output.includes('[[') && output.includes(']]')
    const timeMatch = output.match(/^\d{1,2}:\d{2}:\d{2}(?:\s[AP]M)?\s/)

    if (
      hasHighlight
      || timeMatch
      || this._prefixStyles.length > 0
      || this._textStyles.length > 0
    ) {
      // Complex styling - combine all parts into a single console.log call
      const logParts: string[] = []
      const logStyles: string[] = []
      let remainingOutput = output

      // Handle time
      if (timeMatch && this._displayTime) {
        logParts.push(`%c${timeMatch[0]}`)
        logStyles.push('color: #888; font-size: 0.9em')
        remainingOutput = remainingOutput.substring(timeMatch[0].length)
      }

      // Handle prefix
      if (this._prefix && this._loggerType === 'normal') {
        const { styles: prefixCss } = this.getStyledText(this._prefixStyles, `${this._prefix} `)
        if (prefixCss) {
          logParts.push(`%c${this._prefix} `)
          logStyles.push(prefixCss)
        }
        else {
          logParts.push(`${this._prefix} `)
        }
        remainingOutput = remainingOutput.replace(`${this._prefix} `, '')
      }

      // Handle main text with highlights
      if (hasHighlight) {
        const parts = remainingOutput.split(/(\[\[.+?\]\])/)
        parts.forEach((part) => {
          if (part.match(/\[\[.+?\]\]/)) {
            const text = part.replace(/\[\[(.+?)\]\]/g, '$1')
            logParts.push(`%c${text}`)
            logStyles.push('text-decoration: underline; color: #ffff00; font-weight: bold')
          }
          else if (part.trim()) {
            const { styles: textCss } = this.getStyledText(this._textStyles, part)
            if (textCss) {
              logParts.push(`%c${part}`)
              logStyles.push(textCss)
            }
            else {
              logParts.push(part)
            }
          }
        })
      }
      else if (remainingOutput) {
        const { styles: textCss } = this.getStyledText(this._textStyles, remainingOutput)
        if (textCss) {
          logParts.push(`%c${remainingOutput}`)
          logStyles.push(textCss)
        }
        else {
          logParts.push(remainingOutput)
        }
      }

      // Output everything in a single console.log call
      if (logParts.length > 0) {
        safeConsoleLog(logParts.join(''), ...logStyles)
      }
    }
    else {
      // Simple output
      safeConsoleLog(output)
    }
  }

  printDivider(text: string, styles: Type.Styles): void {
    const { styles: cssStyles } = this.getStyledText(styles, text)
    if (cssStyles) {
      safeConsoleLog(`%c${text}`, cssStyles)
    }
    else {
      safeConsoleLog(text)
    }
  }

  private getStyledText(
    styles: Type.Styles = [],
    text: string,
  ): { text: string, styles?: string } {
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
}

/**
 * Browser-specific stream logger with CSS-styled console output
 */
export class BrowserStreamLogger extends BaseStreamLogger {
  constructor(prefix?: string, prefixStyles?: Type.Styles) {
    super(prefix, prefixStyles)
    this.initializeStream()
  }

  initializeStream(): void {
    // Browser environment - no spinner support
    safeConsoleLog('%c[STREAM STARTED]', 'color: #00ff00; font-weight: bold')
  }

  updateStream(output: string): void {
    // Browser environment - just log the update
    const message = output || '[STREAM UPDATE]'
    safeConsoleLog(`%c[STREAM UPDATE] ${message}`, 'color: #00aaff')
  }

  finalizeStream(state: Type.StreamLoggerState, output: string): void {
    // Browser environment - use styled console logs
    switch (state) {
      case 'start':
        safeConsoleLog(
          `%c[STREAM STARTED] ${output}`,
          'color: #00ff00; font-weight: bold',
        )
        break
      case 'stop':
        safeConsoleLog(
          `%c[STREAM STOPPED] ${output}`,
          'color: #ff8800; font-weight: bold',
        )
        break
      case 'succeed':
        safeConsoleLog(
          `%c✓ [STREAM SUCCESS] ${output}`,
          'color: #00ff00; font-weight: bold',
        )
        break
      case 'fail':
        safeConsoleLog(
          `%c✗ [STREAM FAILED] ${output}`,
          'color: #ff0000; font-weight: bold',
        )
        break
    }
  }

  prefix(prefix: string, styles?: Type.Styles) {
    this._prefix = prefix
    styles && (this._prefixStyles = styles)

    // Browser environment - just store the prefix for later use
    safeConsoleLog(
      `%c[PREFIX SET: ${prefix}]`,
      'color: #888; font-style: italic;',
    )

    return this
  }

  decorateText(content: string, styles?: Type.Styles): string {
    let formattedContent = content || ''
    if (formattedContent) {
      // Browser environment - handle [[text]] pattern differently
      formattedContent = formattedContent.replace(/\[\[(.+?)\]\]/g, '$1')
    }
    return this.getStyledText(styles, formattedContent).text
  }

  printOutput(output: string): void {
    safeConsoleLog(output)
  }

  printDivider(text: string, styles: Type.Styles): void {
    const { styles: cssStyles } = this.getStyledText(styles, text)
    if (cssStyles) {
      safeConsoleLog(`%c${text}`, cssStyles)
    }
    else {
      safeConsoleLog(text)
    }
  }

  toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger {
    if (prefix || prefixStyles) {
      return new BrowserStreamLogger(prefix, prefixStyles)
    }
    return this
  }

  private getStyledText(
    styles: Type.Styles = [],
    text: string,
  ): { text: string, styles?: string } {
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
}
