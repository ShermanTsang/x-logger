/**
 * Logger Factory - Automatically selects the appropriate logger implementation based on environment
 */

import type { BaseLogger as IBaseLogger, BaseStreamLogger as IBaseStreamLogger, Type } from './typings'
import { isBrowser, isNode } from './utils'
import { NodeLogger, NodeStreamLogger } from './logger/node'
import { BrowserLogger, BrowserStreamLogger } from './logger/browser'
import type { BaseLogger, BaseStreamLogger } from './logger/base'

/**
 * Factory class that creates the appropriate logger instance based on the current environment
 */
export class LoggerFactory {
  /**
   * Creates a logger instance appropriate for the current environment
   */
  static createLogger(prefixStyles?: Type.Styles): BaseLogger {
    if (isBrowser) {
      return new BrowserLogger(prefixStyles)
    }
    else if (isNode) {
      return new NodeLogger(prefixStyles)
    }
    else {
      // Fallback to Node logger for unknown environments
      return new NodeLogger(prefixStyles)
    }
  }

  /**
   * Creates a stream logger instance appropriate for the current environment
   */
  static createStreamLogger(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger | BrowserStreamLogger {
    if (isBrowser) {
      return new BrowserStreamLogger(prefix, prefixStyles)
    }
    else if (isNode) {
      return new NodeStreamLogger(prefix, prefixStyles)
    }
    else {
      // Fallback to Node stream logger for unknown environments
      return new NodeStreamLogger(prefix, prefixStyles)
    }
  }

  /**
   * Gets a logger instance for a specific type
   */
  static getLoggerInstance(type: Type.Type, styles?: Type.Styles): BaseLogger {
    if (isBrowser) {
      return BrowserLogger.getLoggerInstance(type, styles)
    }
    else if (isNode) {
      return NodeLogger.getLoggerInstance(type, styles)
    }
    else {
      // Fallback to Node logger for unknown environments
      return NodeLogger.getLoggerInstance(type, styles)
    }
  }

  /**
   * Creates and registers a custom logger type
   */
  static type(type: Type.Type, styles?: Type.Styles): BaseLogger {
    if (isBrowser) {
      return BrowserLogger.type(type, styles)
    }
    else if (isNode) {
      return NodeLogger.type(type, styles)
    }
    else {
      // Fallback to Node logger for unknown environments
      return NodeLogger.type(type, styles)
    }
  }

  /**
   * Gets a stream logger instance
   */
  static get stream(): BaseStreamLogger | BrowserStreamLogger {
    return this.createStreamLogger()
  }

  /**
   * Gets predefined logger types
   */
  static get plain(): BaseLogger {
    return this.getLoggerInstance('plain')
  }

  static get info(): BaseLogger {
    return this.getLoggerInstance('info')
  }

  static get warn(): BaseLogger {
    return this.getLoggerInstance('warn')
  }

  static get error(): BaseLogger {
    return this.getLoggerInstance('error')
  }

  static get debug(): BaseLogger {
    return this.getLoggerInstance('debug')
  }

  static get success(): BaseLogger {
    return this.getLoggerInstance('success')
  }

  static get failure(): BaseLogger {
    return this.getLoggerInstance('failure')
  }
}

/**
 * Unified Logger class that provides the same API as the original Logger
 * but uses the factory pattern internally to select the appropriate implementation
 */
export class Logger implements IBaseLogger {
  private _instance: BaseLogger

  static stylesMap = (LoggerFactory.getLoggerInstance('info').constructor as any).stylesMap

  // Make instanceof work with platform-specific logger instances
  static readonly [Symbol.hasInstance] = (instance: any) => {
    return instance && typeof instance === 'object' && instance._isShermanLogger === true
  }

  constructor(prefixStyles?: Type.Styles) {
    this._instance = LoggerFactory.createLogger(prefixStyles)

    // Delegate all methods to the underlying instance
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target._instance) {
          const value = target._instance[prop as keyof BaseLogger]
          if (typeof value === 'function') {
            return value.bind(target._instance)
          }
          return value
        }
        return Reflect.get(target, prop, receiver)
      },
      set(target, prop, value, receiver) {
        if (prop in target._instance) {
          ;(target._instance as any)[prop] = value
          return true
        }
        return Reflect.set(target, prop, value, receiver)
      },
    })
  }

  static getLoggerInstance(type: Type.Type, styles?: Type.Styles): BaseLogger {
    return LoggerFactory.getLoggerInstance(type, styles)
  }

  static type(type: Type.Type, styles?: Type.Styles): BaseLogger {
    return LoggerFactory.type(type, styles)
  }

  static get stream(): BaseStreamLogger | BrowserStreamLogger {
    return LoggerFactory.stream
  }

  static get plain(): BaseLogger {
    return LoggerFactory.plain
  }

  static get info(): BaseLogger {
    return LoggerFactory.info
  }

  static get warn(): BaseLogger {
    return LoggerFactory.warn
  }

  static get error(): BaseLogger {
    return LoggerFactory.error
  }

  static get debug(): BaseLogger {
    return LoggerFactory.debug
  }

  static get success(): BaseLogger {
    return LoggerFactory.success
  }

  static get failure(): BaseLogger {
    return LoggerFactory.failure
  }

  // Implement BaseLogger interface methods
  text(text: string, styles?: Type.Styles): this {
    this._instance.text(text, styles)
    return this
  }

  detail(detail: string, styles?: Type.Styles): this {
    this._instance.detail(detail, styles)
    return this
  }

  prefix(prefix: string, styles?: Type.Styles): this {
    this._instance.prefix(prefix, styles)
    return this
  }

  data(data: any): this {
    this._instance.data(data)
    return this
  }

  time(isDisplay?: boolean): this {
    this._instance.time(isDisplay)
    return this
  }

  styles(styles: Type.Styles): this {
    this._instance.styles(styles)
    return this
  }

  divider(char?: string, length?: number, styles?: Type.Styles): this {
    this._instance.divider(char, length, styles)
    return this
  }

  prependDivider(char?: string, length?: number, styles?: Type.Styles): this {
    this._instance.prependDivider(char, length, styles)
    return this
  }

  appendDivider(char?: string, length?: number, styles?: Type.Styles): this {
    this._instance.appendDivider(char, length, styles)
    return this
  }

  print(isVisible?: boolean): void {
    return this._instance.print(isVisible)
  }

  toString(): string {
    return this._instance.toString()
  }

  toObject(): this {
    this._instance.toObject()
    return this
  }

  toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger | BrowserStreamLogger {
    return this._instance.toStream(prefix, prefixStyles) as BaseStreamLogger | BrowserStreamLogger
  }

  decorateText(content: string, styles?: Type.Styles): string {
    return this._instance.decorateText(content, styles)
  }

  printOutput(output: string): void {
    return this._instance.printOutput(output)
  }

  printDivider(text: string, styles: Type.Styles): void {
    return this._instance.printDivider(text, styles)
  }

  // Index signature for dynamic property access
  [key: string]: any
}

/**
 * Unified StreamLogger class that provides the same API as the original StreamLogger
 * but uses the factory pattern internally to select the appropriate implementation
 */
export class StreamLogger implements IBaseStreamLogger {
  private _instance: BaseStreamLogger | BrowserStreamLogger

  constructor(prefix?: string, prefixStyles?: Type.Styles) {
    this._instance = LoggerFactory.createStreamLogger(prefix, prefixStyles)

    // Delegate all methods to the underlying instance
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target._instance) {
          const value = (target._instance as any)[prop]
          if (typeof value === 'function') {
            return function (...args: any[]) {
              const result = value.apply(target._instance, args)
              // If the method returns the instance (for chaining), return the proxy instead
              if (result === target._instance) {
                return receiver
              }
              return result
            }
          }
          return value
        }
        return Reflect.get(target, prop, receiver)
      },
      set(target, prop, value, receiver) {
        if (prop in target._instance) {
          ;(target._instance as any)[prop] = value
          return true
        }
        return Reflect.set(target, prop, value, receiver)
      },
    })
  }

  static create(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger | BrowserStreamLogger {
    return LoggerFactory.createStreamLogger(prefix, prefixStyles)
  }

  // Implement BaseStreamLogger interface methods
  text(text?: string, styles?: Type.Styles): this {
    this._instance.text(text, styles)
    return this
  }

  detail(detail?: string, styles?: Type.Styles): this {
    this._instance.detail(detail, styles)
    return this
  }

  prefix(prefix: string, styles?: Type.Styles): this {
    this._instance.prefix(prefix, styles)
    return this
  }

  data(data: any): this {
    this._instance.data(data)
    return this
  }

  time(isDisplay?: boolean): this {
    this._instance.time(isDisplay)
    return this
  }

  styles(styles: Type.Styles): this {
    this._instance.styles(styles)
    return this
  }

  divider(char?: string, length?: number, styles?: Type.Styles): this {
    this._instance.divider(char, length, styles)
    return this
  }

  prependDivider(char?: string, length?: number, styles?: Type.Styles): this {
    this._instance.prependDivider(char, length, styles)
    return this
  }

  appendDivider(char?: string, length?: number, styles?: Type.Styles): this {
    this._instance.appendDivider(char, length, styles)
    return this
  }

  print(isVisible?: boolean): void {
    return this._instance.print(isVisible)
  }

  toString(): string {
    return this._instance.toString()
  }

  toObject(): this {
    this._instance.toObject()
    return this
  }

  toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger | BrowserStreamLogger {
    return this._instance.toStream(prefix, prefixStyles) as BaseStreamLogger | BrowserStreamLogger
  }

  decorateText(content: string, styles?: Type.Styles): string {
    return this._instance.decorateText(content, styles)
  }

  printOutput(output: string): void {
    return this._instance.printOutput(output)
  }

  printDivider(text: string, styles: Type.Styles): void {
    return this._instance.printDivider(text, styles)
  }

  // Stream-specific methods
  delay(delay: number): this {
    this._instance.delay(delay)
    return this
  }

  state(state: 'start' | 'stop' | 'succeed' | 'fail'): this {
    this._instance.state(state)
    return this
  }

  update(): this {
    this._instance.update()
    return this
  }

  async asyncUpdate(delay?: number): Promise<void> {
    return this._instance.asyncUpdate(delay)
  }

  initializeStream(): void {
    return this._instance.initializeStream()
  }

  updateStream(output: string): Promise<void> | void {
    return this._instance.updateStream(output)
  }

  finalizeStream(state: 'start' | 'stop' | 'succeed' | 'fail', output: string): Promise<void> | void {
    return this._instance.finalizeStream(state, output)
  }

  // Convenience methods for common stream states
  succeed(output?: string): this {
    this._instance.succeed(output)
    return this
  }

  fail(output?: string): this {
    this._instance.fail(output)
    return this
  }

  start(output?: string): this {
    this._instance.start(output)
    return this
  }

  stop(output?: string): this {
    this._instance.stop(output)
    return this
  }

  // Index signature for dynamic property access
  [key: string]: any
}
