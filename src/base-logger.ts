/**
 * Base Logger - Abstract foundation for platform-specific logger implementations
 */

import type { Type } from './typings'
import { sleep } from './utils'

/**
 * Abstract base class for all logger implementations
 * Provides common functionality and defines the interface for platform-specific loggers
 */
export abstract class BaseLogger {
  // Static property to identify logger instances
  static readonly [Symbol.hasInstance] = (instance: any) => {
    return instance && typeof instance === 'object' && instance._isShermanLogger === true
  }

  // Track registered custom types
  static registeredTypes: string[] = []
  protected _text: string | null = null
  protected _textStyles: Type.Styles = []
  protected _detail: string | null = null
  protected _detailStyles: Type.Styles = []
  protected _prefix: string | null = null
  protected _prefixStyles: Type.Styles = []
  protected _data: any
  protected _displayTime: boolean = false
  protected _loggerType: 'normal' | 'stream' = 'normal'

  private _prependDivider: boolean = false
  private _prependDividerStyles: Type.Styles = []
  private _prependDividerLength: number = 1
  private _prependDividerChar: string = '-'
  private _appendDivider: boolean = false
  private _appendDividerStyles: Type.Styles = []
  private _appendDividerChar: string = '-'
  private _appendDividerLength: number = 1
  private _singleDivider: boolean = false
  private _singleDividerStyles: Type.Styles = []
  private _singleDividerChar: string = '-'
  private _singleDividerLength: number = 1
  private _isVisible: boolean = true

  constructor(prefixStyles?: Type.Styles) {
    prefixStyles && (this._prefixStyles = prefixStyles)
    // Mark this as a Sherman Logger instance
    ;(this as any)._isShermanLogger = true
  }

  static stylesMap: Record<Type.Type | string, Type.Styles> = {
    info: ['blueBright', 'underline'],
    warn: ['bgYellowBright'],
    error: ['bgRedBright'],
    debug: ['bgCyanBright'],
    success: ['bgGreenBright'],
    failure: ['bgRedBright'],
    plain: ['white'],
  }

  // Abstract methods that must be implemented by platform-specific loggers
  abstract decorateText(content: string, styles?: Type.Styles): string
  abstract printOutput(output: string): void
  abstract printDivider(text: string, styles: Type.Styles): void

  private setDividerProperties(
    type: 'prepend' | 'append' | 'single',
    char: string = '-',
    length: number = 40,
    styles: Type.Styles = ['gray'],
  ) {
    const prefix
      = type === 'prepend'
        ? '_prependDivider'
        : type === 'append'
          ? '_appendDivider'
          : '_singleDivider'
    this[`${prefix}`] = true
    this[`${prefix}Char`] = char || this[`${prefix}Char`]
    this[`${prefix}Styles`] = styles || this[`${prefix}Styles`]
    this[`${prefix}Length`]
      = length || (char && char.length === 1 ? 40 : this[`${prefix}Length`])
  }

  divider(char?: string, length?: number, styles?: Type.Styles) {
    this.setDividerProperties('single', char, length, styles)
    this.print()
  }

  styles(styles: Type.Styles) {
    this._textStyles = styles
    return this
  }

  prependDivider(char?: string, length?: number, styles?: Type.Styles) {
    this.setDividerProperties('prepend', char, length, styles)
    return this
  }

  appendDivider(char?: string, length?: number, styles?: Type.Styles) {
    this.setDividerProperties('append', char, length, styles)
    return this
  }

  time(isDisplay: boolean = true) {
    this._displayTime = isDisplay
    return this
  }

  get formattedTime() {
    return this._displayTime ? `${new Date().toLocaleTimeString()} ` : ''
  }

  text(text: string, styles?: Type.Styles) {
    this._text = text
    styles && (this._textStyles = styles)
    return this
  }

  get formattedText() {
    return this._text
      ? `${this.decorateText(this._text, this._textStyles)} `
      : ''
  }

  detail(detail: string, styles?: Type.Styles) {
    this._detail = detail
    styles && (this._detailStyles = styles)
    return this
  }

  get formattedDetail() {
    return this._detail
      ? `\n${this.decorateText(this._detail, this._detailStyles)}`
      : ''
  }

  prefix(prefix: string, styles?: Type.Styles) {
    this._prefix = prefix
    styles && (this._prefixStyles = styles)
    return this
  }

  get formattedPrefix() {
    return this._prefix
      ? `${this.decorateText(this._prefix, this._prefixStyles)} `
      : ''
  }

  data(data: any) {
    this._data = data
    return this
  }

  get formattedData() {
    if (!this._data) return ''
    
    // Handle different data types appropriately
    if (typeof this._data === 'string') {
      return `\n${this._data}`
    } else if (typeof this._data === 'object') {
      try {
        return `\n${JSON.stringify(this._data, null, 2)}`
      } catch (error) {
        // Handle circular references and other JSON.stringify errors
        return `\n[Circular Reference or Invalid JSON]`
      }
    } else {
      return `\n${String(this._data)}`
    }
  }

  protected composeMainOutput() {
    if (
      this.formattedTime
      || this.formattedText
      || this.formattedDetail
      || this.formattedData
      || this.formattedPrefix
    ) {
      return `${this.formattedTime}${this.formattedPrefix}${this.formattedText}${this.formattedDetail}${this.formattedData}`
    }

    return ''
  }

  print(isVisible: boolean = true) {
    this._isVisible = isVisible
    if (!this._isVisible) {
      return
    }

    if (this._singleDivider) {
      const dividerText = this._singleDividerChar.repeat(
        this._singleDividerLength,
      )
      this.printDivider(dividerText, this._singleDividerStyles)
      return
    }

    if (this._prependDivider) {
      const prependText = this._prependDividerChar.repeat(
        this._prependDividerLength,
      )
      this.printDivider(prependText, this._prependDividerStyles)
    }

    const mainOutput = this.composeMainOutput()
    if (mainOutput) {
      this.printOutput(mainOutput)
    }

    if (this._appendDivider) {
      const appendText = this._appendDividerChar.repeat(
        this._appendDividerLength,
      )
      this.printDivider(appendText, this._appendDividerStyles)
    }
  }

  protected capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  get [Symbol.toStringTag]() {
    return 'ShermanLoggerClass'
  }

  toString() {
    return this.composeMainOutput().toString()
  }

  toObject() {
    return this
  }

  /**
   * Creates a stream logger instance
   */
  abstract toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger | import('./typings').BrowserStreamLogger
}

/**
 * Abstract base class for stream loggers
 */
export abstract class BaseStreamLogger extends BaseLogger {
  protected _state: 'start' | 'stop' | 'succeed' | 'fail' | undefined = undefined
  protected _delay: number = 0
  declare _prefix
  declare _prefixStyles
  declare _text
  declare _detail
  declare _textStyles
  declare _detailStyles
  declare _loggerType: 'normal' | 'stream'

  constructor(prefix?: string, prefixStyles?: Type.Styles) {
    super(prefixStyles || [])
    this._loggerType = 'stream'
    this._state = undefined
    prefix && this.prefix(prefix, prefixStyles)
  }

  // Abstract methods for platform-specific stream handling
  abstract initializeStream(): void
  abstract updateStream(output: string): Promise<void> | void
  abstract finalizeStream(state: Type.StreamLoggerState, output: string): Promise<void> | void

  text(text: string = '', styles?: Type.Styles) {
    this._text = text
    styles && (this._textStyles = styles)
    return this
  }

  detail(detail = '', styles?: Type.Styles) {
    this._detail = detail
    styles && (this._detailStyles = styles)
    return this
  }

  delay(delay: number) {
    this._delay = delay
    return this
  }

  state(state: 'start' | 'stop' | 'succeed' | 'fail'): this {
    this._state = state
    this.update() // Automatically trigger update when state is set
    return this
  }

  update(): void {
    if (this._state) {
      this.updateState(this._state)
    }
    else {
      const output = this.composeMainOutput()
      const result = this.updateStream(output)
      // Handle potential promise without awaiting to maintain sync interface
      if (result instanceof Promise) {
        result.catch(console.error)
      }
    }
  }

  async asyncUpdate(delay?: number): Promise<void> {
    if (this._state) {
      await this.asyncUpdateState(this._state)
    }
    else {
      const output = this.composeMainOutput()
      await this.updateStream(output)
    }
    const _delay = this._delay || delay
    if (_delay) {
      await sleep(_delay)
      this._delay && (this._delay = 0)
    }
  }

  private updateState(state: Type.StreamLoggerState) {
    const output = this.composeMainOutput()
    const result = this.finalizeStream(state, output)
    // Handle potential promise without awaiting to maintain sync interface
    if (result instanceof Promise) {
      result.catch(console.error)
    }
    this._state = undefined
  }

  private async asyncUpdateState(state: Type.StreamLoggerState) {
    const output = this.composeMainOutput()
    await this.finalizeStream(state, output)
    this._state = undefined
  }

  // Convenience methods for common stream states
  succeed(output?: string): this {
    const finalOutput = output || this.composeMainOutput()
    const result = this.finalizeStream('succeed', finalOutput)
    // Handle potential promise without awaiting to maintain sync interface
    if (result instanceof Promise) {
      result.catch(console.error)
    }
    return this
  }

  fail(output?: string): this {
    const finalOutput = output || this.composeMainOutput()
    const result = this.finalizeStream('fail', finalOutput)
    // Handle potential promise without awaiting to maintain sync interface
    if (result instanceof Promise) {
      result.catch(console.error)
    }
    return this
  }

  start(output?: string): this {
    const finalOutput = output || this.composeMainOutput()
    const result = this.finalizeStream('start', finalOutput)
    // Handle potential promise without awaiting to maintain sync interface
    if (result instanceof Promise) {
      result.catch(console.error)
    }
    return this
  }

  stop(output?: string): this {
    const finalOutput = output || this.composeMainOutput()
    const result = this.finalizeStream('stop', finalOutput)
    // Handle potential promise without awaiting to maintain sync interface
    if (result instanceof Promise) {
      result.catch(console.error)
    }
    return this
  }
}
