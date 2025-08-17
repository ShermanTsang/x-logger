/**
 * Browser Logger - Browser-specific logger implementation with CSS styling
 */

import type { BrowserStreamLogger as IBrowserStreamLogger, Type } from './typings'
import { BaseLogger } from './base-logger'
import { safeConsoleLog } from './utils'

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

  toStream(prefix?: string, prefixStyles?: Type.Styles): BrowserStreamLogger {
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
 * Note: Stream operations return void in browser environments as interactive streaming is not supported
 */
export class BrowserStreamLogger extends BaseLogger implements IBrowserStreamLogger {
  protected _state: 'start' | 'stop' | 'succeed' | 'fail' | undefined = undefined
  protected _delay: number = 0
  declare _loggerType: 'normal' | 'stream'

  constructor(prefix?: string, prefixStyles?: Type.Styles) {
    super(prefixStyles || [])
    this._loggerType = 'stream'
    this._state = 'start'
    prefix && this.prefix(prefix, prefixStyles)
  }

  initializeStream(): void {
    // Browser environment - no spinner support, just log a simple message
    // Don't log anything on initialization to avoid console spam
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

  // Setup methods return this for chaining, action methods return void
  prefix(prefix: string, styles?: Type.Styles): this {
    this._prefix = prefix
    styles && (this._prefixStyles = styles)
    return this
  }

  text(text: string = '', styles?: Type.Styles): this {
    this._text = text
    styles && (this._textStyles = styles)
    return this
  }

  detail(detail = '', styles?: Type.Styles): this {
    this._detail = detail
    styles && (this._detailStyles = styles)
    return this
  }

  data(data: any): this {
    this._data = data
    return this
  }

  delay(_delay: number): this {
    // Browser environment - delay is not supported, but return this for chaining
    return this
  }

  // Override asyncUpdate to remove delay functionality in browser
  async asyncUpdate(_delay?: number): Promise<void> {
    // Browser environment - ignore delay parameter and just update immediately
    this.update()
  }

  // Action methods return void (no interactive streaming in browser)
  state(state: 'start' | 'stop' | 'succeed' | 'fail'): void {
    this._state = state
    const output = this.composeMainOutput()
    this.finalizeStream(state, output)
  }

  update(): void {
    const output = this.composeMainOutput()
    this.updateStream(output)
  }

  succeed(output?: string): void {
    const finalOutput = output || this.composeMainOutput()
    this.finalizeStream('succeed', finalOutput)
  }

  fail(output?: string): void {
    const finalOutput = output || this.composeMainOutput()
    this.finalizeStream('fail', finalOutput)
  }

  start(output?: string): void {
    const finalOutput = output || this.composeMainOutput()
    this.finalizeStream('start', finalOutput)
  }

  stop(output?: string): void {
    const finalOutput = output || this.composeMainOutput()
    this.finalizeStream('stop', finalOutput)
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

  toStream(prefix?: string, prefixStyles?: Type.Styles): BrowserStreamLogger {
    // Browser environment - return a new instance that operates with void returns
    return new BrowserStreamLogger(prefix, prefixStyles)
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
