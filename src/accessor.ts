import { Logger } from './logger-factory.ts'
import { typeProxyHandler } from './wrapper.ts'
import type { BaseLogger } from './base-logger.ts'

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
