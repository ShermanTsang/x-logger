/**
 * Node Logger - Node.js-specific logger implementation with Chalk integration
 */

import type { Ora } from 'ora'
import type { Type } from '../typings'
import { safeConsoleLog } from '../utils'
import { BaseLogger, BaseStreamLogger } from './base'

// Lazy-loaded modules for Node.js
let chalk: any = null
let ora: any = null
let modulesLoaded = false

async function loadNodeModules() {
  if (!modulesLoaded) {
    try {
      // Only import Node.js modules in Node.js environments
      const [chalkModule, oraModule] = await Promise.all([
        import('chalk'),
        import('ora'),
      ])
      chalk = chalkModule.default
      ora = oraModule.default
      modulesLoaded = true
    }
    catch (error) {
      safeConsoleLog('Failed to load Node.js modules:', error)
      modulesLoaded = true // Mark as loaded even if failed to prevent retries
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

  static getLoggerInstance(type: Type.Type, styles?: Type.Styles): import('../typings').CallableLogger {
    styles && (NodeLogger.stylesMap[type] = styles)
    const instance = new this(NodeLogger.stylesMap[type])
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.assign(callable, instance)
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return callable as unknown as import('../typings').CallableLogger
  }

  static type(type: Type.Type, styles?: Type.Styles): import('../typings').CallableLogger {
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

  static get plain(): import('../typings').CallableLogger {
    const instance = new NodeLogger(NodeLogger.stylesMap.plain)
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.assign(callable, instance)
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return callable as unknown as import('../typings').CallableLogger
  }

  static get info(): import('../typings').CallableLogger {
    const instance = new NodeLogger(NodeLogger.stylesMap.info)
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.assign(callable, instance)
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return callable as unknown as import('../typings').CallableLogger
  }

  static get warn(): import('../typings').CallableLogger {
    const instance = new NodeLogger(NodeLogger.stylesMap.warn)
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.assign(callable, instance)
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return callable as unknown as import('../typings').CallableLogger
  }

  static get error(): import('../typings').CallableLogger {
    const instance = new NodeLogger(NodeLogger.stylesMap.error)
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.assign(callable, instance)
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return callable as unknown as import('../typings').CallableLogger
  }

  static get debug(): import('../typings').CallableLogger {
    const instance = new NodeLogger(NodeLogger.stylesMap.debug)
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.assign(callable, instance)
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return callable as unknown as import('../typings').CallableLogger
  }

  static get success(): import('../typings').CallableLogger {
    const instance = new NodeLogger(NodeLogger.stylesMap.success)
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.assign(callable, instance)
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return callable as unknown as import('../typings').CallableLogger
  }

  static get failure(): import('../typings').CallableLogger {
    const instance = new NodeLogger(NodeLogger.stylesMap.failure)
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.assign(callable, instance)
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return callable as unknown as import('../typings').CallableLogger
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
  private _isInitialized: boolean = false
  private _initializationPromise: Promise<void>

  constructor(prefix?: string, prefixStyles?: Type.Styles) {
    super(prefix, prefixStyles)
    // Initialize stream after ensuring modules are loaded
    this._initializationPromise = this.initializeStreamAsync()
  }

  private async initializeStreamAsync(): Promise<void> {
    // Wait for modules to load before initializing
    await loadNodeModules()
    if (ora) {
      // Node.js environment with ora
      this._spinner = ora({
        text: this._prefix ? this.decorateText(this._prefix, this._prefixStyles) : '',
        color: 'cyan',
        discardStdin: false, // Fix for Windows hanging issue (ora v4+)
        hideCursor: true,
      })
      this._spinner?.start()
    }
    this._isInitialized = true
  }

  private async ensureInitialized(): Promise<void> {
    if (!this._isInitialized) {
      await this._initializationPromise
    }
  }

  initializeStream(): void {
    if (ora) {
      // Node.js environment with ora
      this._spinner = ora({
        text: this._prefix ? this.decorateText(this._prefix, this._prefixStyles) : '',
        color: 'cyan',
        discardStdin: false, // Fix for Windows hanging issue (ora v4+)
        hideCursor: true,
      })
      this._spinner?.start()
    }
    else {
      // Node.js fallback without ora
      this._spinner = undefined
    }
  }

  async updateStream(output: string): Promise<void> {
    await this.ensureInitialized()
    if (this._spinner) {
      this._spinner.text = output
    }
    // Note: No fallback needed here as spinner should be available after initialization
    // If ora is not available, the spinner will be undefined and no update is needed
  }

  async finalizeStream(state: Type.StreamLoggerState, output: string): Promise<void> {
    await this.ensureInitialized()
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
          // succeed() automatically stops the spinner
          this._spinner.succeed(output)
          this._spinner = undefined
          break
        case 'fail':
          // fail() automatically stops the spinner
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
