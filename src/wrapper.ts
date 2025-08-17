import { Logger } from './logger-factory'
import type { BaseLogger, Type } from './typings'

// Merged from accessor.ts - Custom type proxy functionality

export const typeProxyHandler = new Proxy(Logger, {
  get(target, prop, receiver) {
    if (!(prop in target)) {
      // Check if this is a registered custom type
      try {
        const loggerInstance = Logger.getLoggerInstance('info')
        const customTypes = (loggerInstance.constructor as any).registeredTypes || []
        if (customTypes.includes(prop)) {
          // Return a logger instance for already registered types
          return Logger.getLoggerInstance(prop as string)
        }
      }
      catch {
        // Ignore errors
      }

      // Return a function that creates and registers the custom type
      const customTypeFunction = function (...args: any[]) {
        const [customType, styles] = [prop, args[0]]
        if (styles && Array.isArray(styles)) {
          Logger.type(customType, styles)
          return Logger.getLoggerInstance(customType, styles)
        }
        else {
          throw new TypeError(
            `Invalid arguments for adding a new logger getter.`,
          )
        }
      }

      // Make the function also act as a logger instance when accessed directly
      return new Proxy(customTypeFunction, {
        get(fnTarget, fnProp, fnReceiver) {
          // Check if this is a registered custom type and delegate to logger instance
          try {
            const loggerInstance = Logger.getLoggerInstance('info')
            const customTypes = (loggerInstance.constructor as any).registeredTypes || []
            if (customTypes.includes(prop)) {
              const logger = Logger.getLoggerInstance(prop as string)
              if (fnProp in logger) {
                const value = Reflect.get(logger, fnProp)
                return typeof value === 'function' ? value.bind(logger) : value
              }
            }
          }
          catch {
            // Ignore errors
          }
          return Reflect.get(fnTarget, fnProp, fnReceiver)
        },
      })
    }
    return Reflect.get(target, prop, receiver)
  },
  ownKeys(target) {
    // Include all registered custom types in the keys
    const baseKeys = Reflect.ownKeys(target)
    try {
      const loggerInstance = Logger.getLoggerInstance('info')
      const customTypes = (loggerInstance.constructor as any).registeredTypes || []
      return [...baseKeys, ...customTypes]
    }
    catch {
      return baseKeys
    }
  },
  has(target, prop) {
    // Check if the property exists on the target or is a registered custom type
    if (Reflect.has(target, prop)) {
      return true
    }
    try {
      const loggerInstance = Logger.getLoggerInstance('info')
      const customTypes = (loggerInstance.constructor as any).registeredTypes || []
      return customTypes.includes(prop)
    }
    catch {
      return false
    }
  },
  getOwnPropertyDescriptor(target, prop) {
    if (Reflect.has(target, prop)) {
      return Reflect.getOwnPropertyDescriptor(target, prop)
    }
    try {
      const loggerInstance = Logger.getLoggerInstance('info')
      const customTypes = (loggerInstance.constructor as any).registeredTypes || []
      if (customTypes.includes(prop)) {
        return {
          enumerable: true,
          configurable: true,
          value: Logger.getLoggerInstance(prop as string),
        }
      }
    }
    catch {
      // Ignore errors
    }
    return undefined
  },
}) as typeof Logger & Record<string, BaseLogger>

export function createLoggerWithCustomType<
  T extends Record<string, (styles: Type.Style[]) => BaseLogger>,
>() {
  return typeProxyHandler as unknown as typeof Logger & T
}

// Accessor functionality - merged from accessor.ts
function logger(text: string) {
  return Logger.plain.text(text)
}

export const accessor = new Proxy(logger, {
  get: (target, property: string) => {
    // Check if it's a property on the Logger class or a custom type
    if (property in Logger || property in typeProxyHandler) {
      return Reflect.get(typeProxyHandler, property)
    }
    // call as a function
    return Reflect.get(target, property)
  },
  ownKeys: (target) => {
    const targetKeys = Reflect.ownKeys(target)
    const loggerKeys = Reflect.ownKeys(typeProxyHandler)
    return [...new Set([...targetKeys, ...loggerKeys])]
  },
  has: (target, prop) => {
    return Reflect.has(target, prop) || Reflect.has(typeProxyHandler, prop)
  },
}) as typeof logger & typeof Logger & Record<string, BaseLogger>
