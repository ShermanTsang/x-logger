import type { ChalkInstance } from 'chalk'
import chalk from 'chalk'
import type { Type } from './typings'

function getStyledChalkInstance(styles: Type.Styles = [], text: string) {
  return styles.reduce((accumulator, currentStyle) => {
    return (chalk[currentStyle] as ChalkInstance)(accumulator)
  }, text)
}

export class Logger {
  private _message: string = ''
  private _messageStyles: Type.Styles = []
  private _tag: string | null = null
  private _tagStyles: Type.Styles = []
  private _data: any
  private _displayTime: boolean = false
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

  constructor(tagStyles: Type.Styles) {
    this._tagStyles = tagStyles
  }

  static stylesMap: Record<Type.Type | string, Type.Styles> = {
    info: ['bgBlueBright'],
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

  message(message: string, styles?: Type.Styles) {
    this._message = message
    styles && (this._messageStyles = styles)
    return this
  }

  tag(tag: string, styles?: Type.Styles) {
    this._tag = tag
    styles && (this._tagStyles = styles)
    return this
  }

  data(data: any) {
    this._data = data
    return this
  }

  private formatMessage() {
    let formattedMessage = this._message
    if (formattedMessage) {
      formattedMessage = formattedMessage.replace(
        /\[\[(.+?)\]\]/g,
        chalk.underline.yellow('$1'),
      )
    }
    return getStyledChalkInstance(this._messageStyles, formattedMessage)
  }

  private formatTag() {
    if (!this._tag) {
      return ''
    }

    const tag = this._tag.trim()
    const unifiedTag = ` ${tag.charAt(0).toUpperCase()}${tag.slice(1)} `

    return getStyledChalkInstance(this._tagStyles, unifiedTag)
  }

  print(isVisible: boolean = true) {
    this._isVisible = isVisible
    if (this._isVisible) {
      if (this._singleDivider) {
        console.log(
          getStyledChalkInstance(
            this._singleDividerStyles,
            this._singleDividerChar.repeat(this._singleDividerLength),
          ),
        )
        return
      }

      const tag = this.formatTag()
      const message = this.formatMessage()
      const time = this._displayTime
        ? chalk.gray(new Date().toLocaleTimeString())
        : ''

      if (this._prependDivider) {
        console.log(
          getStyledChalkInstance(
            this._prependDividerStyles,
            this._prependDividerChar.repeat(this._prependDividerLength),
          ),
        )
      }

      const output = `${time} ${tag} ${message}`.trim()
      console.log(output)

      if (this._data) {
        console.log(this._data)
      }

      if (this._appendDivider) {
        console.log(
          getStyledChalkInstance(
            this._appendDividerStyles,
            this._appendDividerChar.repeat(this._appendDividerLength),
          ),
        )
      }
    }
  }
}
