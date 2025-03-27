import type { ChalkInstance } from 'chalk'
import chalk from 'chalk'
import type { Ora } from 'ora'
import ora from 'ora'
import type { Type } from './typings'
import { sleep } from './utils.ts'

function getStyledChalkInstance(styles: Type.Styles = [], text: string) {
  return styles.reduce((accumulator, chalkStyleDescriptor) => {
    if (chalkStyleDescriptor in chalk) {
      return (chalk[chalkStyleDescriptor] as ChalkInstance)(accumulator)
    }
    return accumulator
  }, text)
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
      console.log(
        chalk.yellow.underline(
                    `Logger type "${String(type)}" is preset. Add custom getter will override the preset.`,
        ),
      )
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

  text(text: string, styles?: Type.Styles) {
    this._text = text
    styles && (this._textStyles = styles)
    return this
  }

  detail(detail: string, styles?: Type.Styles) {
    this._detail = detail
    styles && (this._detailStyles = styles)
    return this
  }

  prefix(prefix: string, styles?: Type.Styles) {
    this._prefix = prefix
    styles && (this._prefixStyles = styles)
    return this
  }

  data(data: any) {
    this._data = data
    return this
  }

  protected decorateText(content: string, styles?: Type.Styles) {
    let formattedContent = content || ''
    if (formattedContent) {
      formattedContent = formattedContent.replace(
        /\[\[(.+?)\]\]/g,
        chalk.underline.yellow('$1'),
      )
    }
    return getStyledChalkInstance(styles, formattedContent)
  }

  protected getMainOutput() {
    const formattedPrefix = this._prefix ? this.decorateText(this._prefix, this._prefixStyles) : ''
    const formattedText = this._text ? this.decorateText(this._text, this._textStyles) : ''
    const formattedDetail = this._detail ? `\n${this.decorateText(this._detail, this._detailStyles)}` : ''
    const formattedData = this._data ? `\n${this._data}` : '111'

    const formattedTime = this._displayTime ? chalk.gray(new Date().toLocaleTimeString()) : ''

    if (formattedTime || formattedText || formattedDetail || formattedData || (this._loggerType === 'normal' && formattedPrefix)) {
      return `${formattedTime}${this._loggerType === 'normal' ? formattedPrefix : ''}${formattedText}${formattedDetail}${formattedData}`
    }

    return ''
  }

  print(isVisible: boolean = true) {
    this._isVisible = isVisible
    if (!this._isVisible) {
      return
    }

    if (this._singleDivider) {
      console.log(
        getStyledChalkInstance(
          this._singleDividerStyles,
          this._singleDividerChar.repeat(this._singleDividerLength),
        ),
      )
      return
    }

    if (this._prependDivider) {
      console.log(
        getStyledChalkInstance(
          this._prependDividerStyles,
          this._prependDividerChar.repeat(this._prependDividerLength),
        ),
      )
    }

    console.log(this.getMainOutput())

    if (this._appendDivider) {
      console.log(
        getStyledChalkInstance(
          this._appendDividerStyles,
          this._appendDividerChar.repeat(this._appendDividerLength),
        ),
      )
    }
  }

  protected capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  get [Symbol.toStringTag]() {
    return 'ShermanLoggerClass'
  }

  toString() {
    return this.toObject.toString()
  }

  toObject() {
    return this
  }
}

export class StreamLogger extends Logger {
  protected _state: 'start' | 'stop' | 'succeed' | 'fail' | undefined = undefined
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

    this._spinner = ora()
    this._spinner.start()
    this._state = 'start'

    prefix && this.prefix(prefix, prefixStyles)

    return this
  }

  prefix(prefix: string, styles?: Type.Styles) {
    if (!this._spinner) {
      return this
    }
    this._prefix = prefix

    styles && (this._prefixStyles = styles)

    this._spinner.prefixText = this.decorateText(this._prefix, this._prefixStyles)
    return this
  }

  text(text: string = '', styles?: Type.Styles) {
    if (!this._spinner) {
      return this
    }
    this._text = text
    styles && (this._textStyles = styles)
    return this
  }

  detail(detail = '', styles?: Type.Styles) {
    if (!this._spinner) {
      return this
    }
    this._detail = detail
    styles && (this._detailStyles = styles)
    return this
  }

  delay(delay: number) {
    if (!this._spinner) {
      return this
    }
    this._delay = delay
    return this
  }

  state(state: 'start' | 'stop' | 'succeed' | 'fail') {
    this._state = state
    return this
  }

  update(): void {
    if (!this._spinner) {
      return
    }

    if (this._state) {
      this.updateState(this._state)
    }
    else {
      this._spinner.text = this.getMainOutput()
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
    if (!this._spinner) {
      return this
    }

    switch (state) {
      case 'start':
        this._spinner.start(this.getMainOutput())
        break
      case 'stop':
        if (!this._spinner) {
          return this
        }
        this._spinner.stop()
        this._spinner = undefined
        break
      case 'succeed':
        if (!this._spinner) {
          return this
        }
        this._spinner.succeed(this.getMainOutput())
        this._spinner = undefined
        break
      case 'fail':
        if (!this._spinner) {
          return this
        }
        this._spinner.fail(this.getMainOutput())
        this._spinner = undefined
        break
    }

    this._state = undefined
  }
}
