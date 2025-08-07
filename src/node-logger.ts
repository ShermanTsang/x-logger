/**
 * Node Logger - Node.js-specific logger implementation with Chalk integration
 */

import type { Ora } from 'ora'
import type { Type } from './typings'
import { BaseLogger, BaseStreamLogger } from './base-logger'
import { safeConsoleLog } from './utils'

// Lazy-loaded modules for Node.js
let chalk: any = null
let ora: any = null

async function loadNodeModules() {
  if (!chalk) {
    try {
      // Only import Node.js modules in Node.js environments
      const [chalkModule, oraModule] = await Promise.all([
        import('chalk'),
        import('ora'),
      ])
      chalk = chalkModule.default
      ora = oraModule.default
    }
    catch (error) {
      safeConsoleLog('Failed to load Node.js modules:', error)
    }
  }
}

// Initialize modules for Node.js
loadNodeModules()

/**
 * Node.js-specific logger implementation with Chalk styling support
 */
export class NodeLogger extends BaseLogger {
  constructor(prefixStyles?: Type.Styles) {
    super(prefixStyles)
  }

  static getLoggerInstance(type: Type.Type, styles?: Type.Styles) {
    styles && (NodeLogger.stylesMap[type] = styles)
    return new this(NodeLogger.stylesMap[type])
  }

  static type(type: Type.Type, styles?: Type.Styles) {
    if (type in NodeLogger && styles) {
      if (chalk) {
        safeConsoleLog(
          chalk.yellow.underline(
            `Logger type "${String(type)}" is preset. Add custom getter will override the preset.`,
          ),
        )
      }
      else {
        safeConsoleLog(
          `Logger type "${String(type)}" is preset. Add custom getter will override the preset.`,
        )
      }
    }
    if (styles) {
      NodeLogger.stylesMap[type] = styles
      // Track registered custom types
      if (!NodeLogger.registeredTypes.includes(String(type))) {
        NodeLogger.registeredTypes.push(String(type))
      }
    }
    const loggerInstance = NodeLogger.getLoggerInstance(type, styles)
    Object.defineProperty(NodeLogger, type, {
      get() {
        return loggerInstance
      },
      configurable: true,
      enumerable: true,
    })
    return loggerInstance
  }

  static get stream() {
    return new NodeStreamLogger()
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

  decorateText(content: string, styles?: Type.Styles): string {
    let formattedContent = content || ''
    if (formattedContent) {
      if (chalk) {
        // Node.js environment with chalk - handle [[text]] pattern
        formattedContent = formattedContent.replace(
          /\[\[(.+?)\]\]/g,
          chalk.underline.yellow('$1'),
        )
      }
      else {
        // Fallback - just remove brackets
        formattedContent = formattedContent.replace(/\[\[(.+?)\]\]/g, '$1')
      }
    }
    return this.getStyledChalkInstance(styles, formattedContent)
  }

  printOutput(output: string): void {
    safeConsoleLog(output)
  }

  printDivider(text: string, styles: Type.Styles): void {
    safeConsoleLog(this.getStyledChalkInstance(styles, text))
  }

  toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger {
    const streamLogger = new NodeStreamLogger(prefix, prefixStyles)
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

  private getStyledChalkInstance(styles: Type.Styles = [], text: string): string {
    if (chalk) {
      return styles.reduce((accumulator, chalkStyleDescriptor) => {
        if (chalkStyleDescriptor in chalk) {
          return chalk[chalkStyleDescriptor](accumulator)
        }
        return accumulator
      }, text)
    }
    return text
  }
}

/**
 * Node.js-specific stream logger with Ora spinner support
 */
export class NodeStreamLogger extends BaseStreamLogger {
  protected _spinner: Ora | undefined = undefined

  constructor(prefix?: string, prefixStyles?: Type.Styles) {
    super(prefix, prefixStyles)
    this.initializeStream()
  }

  initializeStream(): void {
    if (ora) {
      // Node.js environment with ora
      this._spinner = ora()
      this._spinner?.start()
    }
    else {
      // Node.js fallback without ora
      this._spinner = undefined
      safeConsoleLog('[STREAM STARTED]')
    }
  }

  updateStream(output: string): void {
    if (this._spinner) {
      this._spinner.text = output
    }
    else {
      // Fallback when no spinner is available
      const message = output || '[STREAM UPDATE]'
      safeConsoleLog(`[STREAM UPDATE] ${message}`)
    }
  }

  finalizeStream(state: Type.StreamLoggerState, output: string): void {
    if (this._spinner) {
      // Node.js environment with spinner
      switch (state) {
        case 'start':
          this._spinner.start(output)
          break
        case 'stop':
          this._spinner.stop()
          this._spinner = undefined
          break
        case 'succeed':
          this._spinner.succeed(output)
          this._spinner = undefined
          break
        case 'fail':
          this._spinner.fail(output)
          this._spinner = undefined
          break
      }
    }
    else {
      // Node.js fallback without spinner
      switch (state) {
        case 'start':
          safeConsoleLog(`[STREAM STARTED] ${output}`)
          break
        case 'stop':
          safeConsoleLog(`[STREAM STOPPED] ${output}`)
          break
        case 'succeed':
          safeConsoleLog(`✓ [STREAM SUCCESS] ${output}`)
          break
        case 'fail':
          safeConsoleLog(`✗ [STREAM FAILED] ${output}`)
          break
      }
    }
  }

  prefix(prefix: string, styles?: Type.Styles) {
    this._prefix = prefix
    styles && (this._prefixStyles = styles)

    if (this._spinner) {
      this._spinner.prefixText = this.decorateText(
        this._prefix,
        this._prefixStyles,
      )
    }

    return this
  }

  decorateText(content: string, styles?: Type.Styles): string {
    let formattedContent = content || ''
    if (formattedContent) {
      if (chalk) {
        // Node.js environment with chalk - handle [[text]] pattern
        formattedContent = formattedContent.replace(
          /\[\[(.+?)\]\]/g,
          chalk.underline.yellow('$1'),
        )
      }
      else {
        // Fallback - just remove brackets
        formattedContent = formattedContent.replace(/\[\[(.+?)\]\]/g, '$1')
      }
    }
    return this.getStyledChalkInstance(styles, formattedContent)
  }

  printOutput(output: string): void {
    safeConsoleLog(output)
  }

  printDivider(text: string, styles: Type.Styles): void {
    safeConsoleLog(this.getStyledChalkInstance(styles, text))
  }

  toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger {
    if (prefix || prefixStyles) {
      return new NodeStreamLogger(prefix, prefixStyles)
    }
    return this
  }

  private getStyledChalkInstance(styles: Type.Styles = [], text: string): string {
    if (chalk) {
      return styles.reduce((accumulator, chalkStyleDescriptor) => {
        if (chalkStyleDescriptor in chalk) {
          return chalk[chalkStyleDescriptor](accumulator)
        }
        return accumulator
      }, text)
    }
    return text
  }
}
