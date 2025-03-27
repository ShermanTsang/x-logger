import type { ChalkInstance } from 'chalk'
import chalk from 'chalk'
import type { Color, Ora } from 'ora'
import ora from 'ora'
import type { Type } from './typings'
import { logger } from './index.ts'
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
  private _text: string | null = null
  private _textStyles: Type.Styles = []
  private _prefix: string | null = null
  private _prefixStyles: Type.Styles = []
  private _data: any
  private _displayTime: boolean = false
  private _displayData: boolean = true
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

  constructor(prefixStyles: Type.Styles) {
    this._prefixStyles = prefixStyles
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

  static toStream(type: Type.Type) {
    const styles = Logger.stylesMap[type] || Logger.stylesMap.info
    return new StreamLogger(undefined, styles)
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

  prefix(prefix: string, styles?: Type.Styles) {
    this._prefix = prefix
    styles && (this._prefixStyles = styles)
    return this
  }

  data(data: any, displayData?: boolean) {
    this._data = data
    displayData && (this._displayData = displayData)
    return this
  }

  private formatText() {
    let formattedText = this._text || ''
    if (formattedText) {
      formattedText = formattedText.replace(
        /\[\[(.+?)\]\]/g,
        chalk.underline.yellow('$1'),
      )
    }
    return getStyledChalkInstance(this._textStyles, formattedText)
  }

  private formatPrefix() {
    if (!this._prefix) {
      return ''
    }

    const prefix = this._prefix.trim()
    const unifiedPrefix = ` ${prefix.charAt(0).toUpperCase()}${prefix.slice(1)} `

    return getStyledChalkInstance(this._prefixStyles, unifiedPrefix)
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

      const prefix = this.formatPrefix()
      const text = this.formatText()
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

      if (time || prefix || text) {
        const output = `${time} ${prefix} ${text}`.trim()
        console.log(output)
      }

      if (this._displayData && this._data) {
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

  toString() {
    return this.formatText()
  }
}

export class StreamLogger {
  public state: 'start' | 'stop' | 'succeed' | 'fail' | undefined = undefined

  private spinner: Ora | undefined = undefined
  private delay: number = 0
  private text: string = ''
  private color: Color = 'yellow'
  private detail: string = ''
  private prefixText: string | undefined = undefined
  private textStyles: Type.Styles = []
  private detailStyles: Type.Styles = []
  private prefixTextStyles: Type.Styles = []

  constructor(prefixText?: string, prefixTextStyles?: Type.Styles) {
    this.prefixText = prefixText
    prefixTextStyles && (this.prefixTextStyles = prefixTextStyles)
    this.create()
    return this
  }

  private create() {
    this.spinner = ora()
    this.spinner.start()
    this.state = 'start'

    if (this.prefixText) {
      this.spinner.prefixText = this.decorateText(this.capitalize(this.prefixText), this.prefixTextStyles)
    }

    return this
  }

  private capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  private decorateText(text: string = '', styles?: Type.Styles) {
    return logger(getStyledChalkInstance(styles || this.textStyles, text)).toString()
  }

  /**
   * Sets the text for the spinner
   * @param text Text to display
   * @param styles Optional styling for the text
   * @returns This StreamLogger instance for chaining
   */
  setText(text: string = '', styles?: Type.Styles) {
    if (!this.spinner) {
      return this
    }
    this.text = text
    styles && (this.textStyles = styles)
    return this
  }

  /**
   * Sets the detail text displayed below the main spinner text
   * @param detail Detail text to display
   * @param styles Optional styling for the detail text
   * @returns This StreamLogger instance for chaining
   */
  setDetail(detail = '', styles?: Type.Styles) {
    if (!this.spinner) {
      return this
    }
    this.detail = detail
    styles && (this.detailStyles = styles)
    return this
  }

  /**
   * Sets a delay before updating the spinner
   * @param delay Delay in milliseconds
   * @returns This StreamLogger instance for chaining
   */
  setDelay(delay: number) {
    if (!this.spinner) {
      return this
    }
    this.delay = delay
    return this
  }

  /**
   * Updates the spinner with current text and detail
   * @returns Promise that resolves after the delay (if any)
   */
  async update(): Promise<void> {
    if (!this.spinner) {
      return
    }

    let finalText = `${this.decorateText(this.capitalize(this.text), this.textStyles)}`
    if (this.detail.length > 0) {
      finalText += `\n${this.decorateText(this.detail, this.detailStyles)}`
    }
    this.text = finalText

    if (this.state) {
      this.changeState(this.state, this.text)
    }
    else {
      this.spinner.text = this.text
    }

    if (this.color && this.spinner) {
      this.spinner.color = this.color
    }

    if (this.delay > 0) {
      await sleep(this.delay)
    }
  }

  /**
   * Sets the state of the spinner
   * @param state State to set (start, stop, succeed, fail)
   * @returns This StreamLogger instance for chaining
   */
  setState(state: 'start' | 'stop' | 'succeed' | 'fail') {
    this.state = state
    return this
  }

  /**
   * Sets the color of the spinner
   * @param color Color to set the spinner to
   * @returns This StreamLogger instance for chaining
   */
  setColor(color: Color) {
    this.color = color
    if (this.spinner) {
      this.spinner.color = color
    }
    return this
  }

  /**
   * Apply Logger type styles to this StreamLogger
   * @param type The logger type to use for styling
   * @returns This StreamLogger instance for chaining
   */
  withType(type: Type.Type) {
    const styles = Logger.stylesMap[type] || Logger.stylesMap.info
    this.textStyles = styles
    return this
  }

  private changeState(state: 'start' | 'stop' | 'succeed' | 'fail' | 'destroy', text?: string) {
    if (!this.spinner) {
      return this
    }

    switch (state) {
      case 'start':
        this.spinner.start(text)
        break
      case 'stop':
        this.stop()
        break
      case 'succeed':
        this.succeed(text)
        break
      case 'destroy':
        this.destroy()
        break
      case 'fail':
        this.fail(text)
        break
    }

    this.state = undefined
  }

  private stop() {
    if (!this.spinner) {
      return this
    }
    this.spinner.stop()
    return this
  }

  private destroy() {
    this.stop()
    this.spinner = undefined
    return this
  }

  private succeed(text: string = '') {
    if (!this.spinner) {
      return this
    }
    this.spinner.succeed(this.decorateText(text))
    this.spinner = undefined
    return this
  }

  private fail(text: string = '') {
    if (!this.spinner) {
      return this
    }
    this.spinner.fail(this.decorateText(text))
    this.spinner = undefined
    return this
  }
}
