import { Logger } from './core.ts'
import { typeProxyHandler } from './wrapper.ts'

function logger(message: string) {
  return Logger.plain.message(message)
}

export const accessor = new Proxy(logger, {
  get: (target, property: string) => {
    if (Reflect.ownKeys(Logger).includes(property)) {
      return typeProxyHandler[property]
    }
    return Reflect.get(target, property)
  },
}) as typeof logger & typeof Logger & Record<string, Logger>
