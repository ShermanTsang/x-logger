/**
 * Logger Factory - Automatically selects the appropriate logger implementation based on environment
 */

import type { BaseLogger as IBaseLogger, BaseStreamLogger as IBaseStreamLogger, Type, CallableLogger } from './typings'
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
   * Creates a logger instance with valid condition
   */
  static valid(isValid: boolean = true): CallableLogger {
    const logger = LoggerFactory.createLogger()
    return logger.valid(isValid) as unknown as CallableLogger
  }

  /**
   * Gets a logger instance for a specific type
   */
  static getLoggerInstance(type: Type.Type, styles?: Type.Styles): CallableLogger {
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
  static type(type: Type.Type, styles?: Type.Styles): CallableLogger {
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
   * Gets predefined logger types - can be used as both getters and methods
   */
  static get plain(): CallableLogger {
    const instance = this.getLoggerInstance('plain')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance))
  }

  static get info(): CallableLogger {
    const instance = this.getLoggerInstance('info')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance))
  }

  static get warn(): CallableLogger {
    const instance = this.getLoggerInstance('warn')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance))
  }

  static get error(): CallableLogger {
    const instance = this.getLoggerInstance('error')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance))
  }

  static get debug(): CallableLogger {
    const instance = this.getLoggerInstance('debug')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance))
  }

  static get success(): CallableLogger {
    const instance = this.getLoggerInstance('success')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance))
  }

  static get failure(): CallableLogger {
    const instance = this.getLoggerInstance('failure')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    return Object.setPrototypeOf(Object.assign(callable, instance), Object.getPrototypeOf(instance))
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

  static getLoggerInstance(type: Type.Type, styles?: Type.Styles): CallableLogger {
    return LoggerFactory.getLoggerInstance(type, styles)
  }

  static valid(isValid: boolean = true): CallableLogger {
    return LoggerFactory.valid(isValid)
  }

  static type(type: Type.Type, styles?: Type.Styles): CallableLogger {
    return LoggerFactory.type(type, styles)
  }

  static get stream(): BaseStreamLogger | BrowserStreamLogger {
    return LoggerFactory.stream
  }

  static get plain(): CallableLogger {
    const instance = LoggerFactory.getLoggerInstance('plain')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return Object.assign(callable, instance) as any
  }

  static get info(): CallableLogger {
    const instance = LoggerFactory.getLoggerInstance('info')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return Object.assign(callable, instance) as any
  }

  static get warn(): CallableLogger {
    const instance = LoggerFactory.getLoggerInstance('warn')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return Object.assign(callable, instance) as any
  }

  static get error(): CallableLogger {
    const instance = LoggerFactory.getLoggerInstance('error')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return Object.assign(callable, instance) as any
  }

  static get debug(): CallableLogger {
    const instance = LoggerFactory.getLoggerInstance('debug')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return Object.assign(callable, instance) as any
  }

  static get success(): CallableLogger {
    const instance = LoggerFactory.getLoggerInstance('success')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return Object.assign(callable, instance) as any
  }

  static get failure(): CallableLogger {
    const instance = LoggerFactory.getLoggerInstance('failure')
    const callable = (...args: any[]) => {
      return args.length > 0 ? instance.text(...args) : instance
    }
    Object.setPrototypeOf(callable, Object.getPrototypeOf(instance))
    return Object.assign(callable, instance) as any
  }

  // Implement BaseLogger interface methods
  text(...args: any[]): this {
    this._instance.text(...args)
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

  print(isValid?: boolean): void {
    return this._instance.print(isValid)
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

  valid(isValid?: boolean): this {
    this._instance.valid(isValid)
    return this
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
  text(...args: any[]): this {
    this._instance.text(...args)
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

  print(isValid?: boolean): void {
    return this._instance.print(isValid)
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

  valid(isValid?: boolean): this {
    this._instance.valid(isValid)
    return this
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
