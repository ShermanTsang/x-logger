import type { Ora } from 'ora'
import {
  getStyledText,
  isBrowser,
  isNode,
  logWithStyle,
  safeConsoleLog,
} from './adapter.ts'
import type { Type } from './typings'
import { sleep } from './utils.ts'

// Lazy-loaded modules for Node.js
let chalk: any = null
let ora: any = null

async function loadNodeModules() {
  // eslint-disable-next-line node/prefer-global/process
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'browser' && isNode && !isBrowser && !chalk) {
    try {
      // Only import Node.js modules in Node.js environments, not in browser builds
      const [chalkModule, oraModule] = await Promise.all([
        import('chalk'),
        import('ora'),
      ])
      chalk = chalkModule.default
      ora = oraModule.default
    }
    catch (error) {
      // Silently fail in browser environments or when modules are not available
      if (isNode && !isBrowser) {
        safeConsoleLog('Failed to load Node.js modules:', error)
      }
    }
  }
}

// Initialize modules for Node.js only
if (isNode && !isBrowser) {
  loadNodeModules()
}

function getStyledChalkInstance(styles: Type.Styles = [], text: string) {
  if (isBrowser) {
    const { text: styledText } = getStyledText(styles, text)
    return styledText
  }
  else if (chalk) {
    return styles.reduce((accumulator, chalkStyleDescriptor) => {
      if (chalkStyleDescriptor in chalk) {
        return chalk[chalkStyleDescriptor](accumulator)
      }
      return accumulator
    }, text)
  }
  return text
}

export class Logger {
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

  static getLoggerInstance(type: Type.Type, styles?: Type.Styles) {
    styles && (Logger.stylesMap[type] = styles)
    return new this(Logger.stylesMap[type])
  }

  static type(type: Type.Type, styles?: Type.Styles) {
    if (type in Logger && styles) {
      if (isBrowser) {
        safeConsoleLog(
          `%cLogger type "${String(type)}" is preset. Add custom getter will override the preset.`,
          'color: #ffff00; text-decoration: underline',
        )
      }
      else if (chalk) {
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
    const loggerInstance = Logger.getLoggerInstance(type, styles)
    Object.defineProperty(Logger, type, {
      get() {
        return loggerInstance
      },
      configurable: true,
      enumerable: true,
    })
    return loggerInstance
  }

  static get stream() {
    return new StreamLogger()
  }

  toStream(prefix?: string, prefixStyles?: Type.Styles) {
    const streamLogger = new StreamLogger(prefix, prefixStyles)
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
    return this._data ? `\n${this._data}` : ''
  }

  protected decorateText(content: string, styles?: Type.Styles) {
    let formattedContent = content || ''
    if (formattedContent) {
      if (isBrowser) {
        // Browser environment - handle [[text]] pattern differently
        formattedContent = formattedContent.replace(/\[\[(.+?)\]\]/g, '$1')
      }
      else if (chalk) {
        // Node.js environment with chalk
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
    return getStyledChalkInstance(styles, formattedContent)
  }

  protected composeMainOutput() {
    if (
      this.formattedTime
      || this.formattedText
      || this.formattedDetail
      || this.formattedData
      || (this._loggerType === 'normal' && this.formattedPrefix)
    ) {
      return `${this.formattedTime}${this._loggerType === 'normal' ? this.formattedPrefix : ''}${this.formattedText}${this.formattedDetail}${this.formattedData}`
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
      if (isBrowser) {
        logWithStyle(dividerText, this._singleDividerStyles)
      }
      else {
        safeConsoleLog(
          getStyledChalkInstance(this._singleDividerStyles, dividerText),
        )
      }
      return
    }

    if (this._prependDivider) {
      const prependText = this._prependDividerChar.repeat(
        this._prependDividerLength,
      )
      if (isBrowser) {
        logWithStyle(prependText, this._prependDividerStyles)
      }
      else {
        safeConsoleLog(
          getStyledChalkInstance(this._prependDividerStyles, prependText),
        )
      }
    }

    const mainOutput = this.composeMainOutput()
    if (isBrowser) {
      // For browser, we need to handle styled output differently
      this.printBrowserOutput(mainOutput)
    }
    else {
      safeConsoleLog(mainOutput)
    }

    if (this._appendDivider) {
      const appendText = this._appendDividerChar.repeat(
        this._appendDividerLength,
      )
      if (isBrowser) {
        logWithStyle(appendText, this._appendDividerStyles)
      }
      else {
        safeConsoleLog(
          getStyledChalkInstance(this._appendDividerStyles, appendText),
        )
      }
    }
  }

  private printBrowserOutput(output: string) {
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
        const { styles: prefixCss } = getStyledText(this._prefixStyles, `${this._prefix} `)
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
            const { styles: textCss } = getStyledText(this._textStyles, part)
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
        const { styles: textCss } = getStyledText(this._textStyles, remainingOutput)
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
}

export class StreamLogger extends Logger {
  protected _state: 'start' | 'stop' | 'succeed' | 'fail' | undefined
  = undefined

  protected _spinner: Ora | undefined = undefined
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

    if (isBrowser) {
      // Browser environment - no spinner support
      this._spinner = undefined
      safeConsoleLog('%c[STREAM STARTED]', 'color: #00ff00; font-weight: bold')
    }
    else if (ora) {
      // Node.js environment with ora
      this._spinner = ora()
      this._spinner?.start()
    }
    else {
      // Node.js fallback without ora
      this._spinner = undefined
      safeConsoleLog('[STREAM STARTED]')
    }

    this._state = 'start'
    prefix && this.prefix(prefix, prefixStyles)

    return this
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
    else if (isBrowser) {
      // Browser environment - just store the prefix for later use
      safeConsoleLog(
        `%c[PREFIX SET: ${prefix}]`,
        'color: #888; font-style: italic;',
      )
    }

    return this
  }

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

  state(state: 'start' | 'stop' | 'succeed' | 'fail') {
    this._state = state
    return this
  }

  update(): void {
    if (this._state) {
      this.updateState(this._state)
    }
    else if (this._spinner) {
      this._spinner.text = this.composeMainOutput()
    }
    else if (isBrowser) {
      // Browser environment - just log the update
      const output = this.composeMainOutput()
      if (output) {
        safeConsoleLog(`%c[STREAM UPDATE] ${output}`, 'color: #00aaff')
      }
    }
  }

  async asyncUpdate(delay?: number): Promise<void> {
    this.update()
    const _delay = this._delay || delay
    if (_delay) {
      await sleep(_delay)
      this._delay && (this._delay = 0)
    }
  }

  private updateState(state: Type.StreamLoggerState) {
    const output = this.composeMainOutput()

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
    else if (isBrowser) {
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

    this._state = undefined
  }
}
