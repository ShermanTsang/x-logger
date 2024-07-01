import { Logger } from './core.ts'
import type { Type } from './typings'

export const loggerProxy = new Proxy(Logger, {
  get(target, prop, receiver) {
    if (!(prop in target)) {
      return function (...args: any[]) {
        const [customType, styles] = [prop, args[0]]
        if (styles && typeof styles === 'object') {
          Logger.type(customType, styles)
          return Logger.getLoggerInstance(customType, styles)
        }
        else {
          throw new TypeError(
            `Invalid arguments for adding a new logger getter.`,
          )
        }
      }
    }
    return Reflect.get(target, prop, receiver)
  },
}) as typeof Logger & Record<string, Logger>

export function createLoggerWithCustomTypeProxy<
  T extends Record<string, (styles: Type.Style[]) => Logger>,
>() {
  return loggerProxy as unknown as typeof Logger & T
}
