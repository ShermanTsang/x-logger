import { expect, it } from 'vitest'
import type { Logger } from '../src'
import { createLogger, logger } from '../src/index'
import type { LoggerType } from '../src/typings'

it('add custom logger type via `type` function', () => {
  const newType = 'test'
  expect(Reflect.ownKeys(logger).includes(newType)).toBeFalsy()
  logger.type(newType, ['bgGreenBright', 'underline'])
  expect(Reflect.ownKeys(logger)).toContain(newType)
  logger
    .type(newType)
    .tag('custom logger')
    .message('test adding custom logger type via type function')
    .appendDivider('*')
    .print()
})

it('add custom logger type via proxy', () => {
  const logger = createLogger<{
    newType: LoggerType.CreateCustomType
  }>()

  expect(Reflect.ownKeys(logger).includes('newType')).toBeFalsy()

  logger
    .newType(['bgGreenBright', 'underline'])
    .tag('custom logger')
    .message('test adding custom logger type via type function')
    .print()

  logger
    .type('newType')
    .tag('custom logger')
    .message('The next time you can use `newType` with `type` function')
    .print()

  // Not recommend code style
  const newType = logger.newType as unknown as Logger
  newType
    .tag('custom logger')
    .message('Also, you can use `newType` directly, but not recommend')
    .print()

  expect(Reflect.ownKeys(logger)).toContain('newType')
})

it('override preset logger type', () => {
  const styles: (typeof logger.stylesMap)['info'] = ['bgYellow']
  logger.type('info', styles)
  expect(logger.stylesMap.info).toBe(styles)
  logger.info
    .tag('info')
    .message('test overriding preset logger type')
    .prependDivider()
    .print()
})
