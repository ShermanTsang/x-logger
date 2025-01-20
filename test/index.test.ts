import { describe, expect, it } from 'vitest'
import type { Logger as LoggerType } from '../src'
import { Logger } from '../src'
import { createLogger, logger } from '../src/index'
import type { Type } from '../src/typings'

describe('logger', () => {
  it('access polymorphic logger', () => {
    expect(() => {
      logger('anything you wanna put here').print()
      logger.info.tag('OKAY').message('test').print()
    }).not.toThrow()
  })

  it('add custom logger type via `type` function', () => {
    const customLoggerType = 'test'

    // Ensure the custom type does not exist before adding
    expect(Reflect.ownKeys(logger.stylesMap)).not.toContain(customLoggerType)

    // Add a custom logger type
    logger.type(customLoggerType, ['bgGreenBright', 'underline'])

    // Verify the custom type was added
    expect(Reflect.ownKeys(logger.stylesMap)).toContain(customLoggerType)

    // Use the custom logger type
    logger
      .type(customLoggerType)
      .tag('custom logger')
      .message('test adding custom logger type via type function')
      .appendDivider('*')
      .print()
  })

  it('add custom logger type via proxy', () => {
    const logger = createLogger<{
      newType: Type.CreateCustomType
    }>()

    // Ensure the custom type does not exist before adding
    expect(Reflect.ownKeys(logger)).not.toContain('newType')

    // Add and use the custom logger type via proxy
    logger
      .newType(['bgRedBright', 'underline'])
      .tag('custom logger')
      .message('test adding custom logger type via proxy function')
      .print()

    // Use the type function to add and use the custom logger type
    logger
      .type('newType')
      .tag('custom logger')
      .message('The next time you can use `newType` with `type` function')
      .print()

    // Not recommended style: directly using the new type
    const customLoggerType = logger.newType as unknown as LoggerType
    customLoggerType
      .tag('custom logger')
      .message('Also, you can use `newType` directly, but not recommend')
      .print()

    // Verify the custom type was added
    expect(Reflect.ownKeys(logger)).toContain('newType')
  })

  it('override preset logger type', () => {
    const newStyles: (typeof logger.stylesMap)['info'] = ['bgYellow']

    // Override the 'info' logger type with new styles
    logger.type('info', newStyles)

    // Verify the styles were updated
    expect(logger.stylesMap.info).toBe(newStyles)

    // Use the overridden logger type
    logger.info
      .tag('info')
      .message('test overriding preset logger type')
      .prependDivider()
      .print()
  })

  it('reuse logger instance', () => {
    const reusedLogger = Logger.type('info').time().prependDivider('♥')

    // Use the reused logger instance to print multiple messages
    reusedLogger.tag('love').message('the world').print()
    reusedLogger.tag('love').message('you').print()
  })

  it('transform to string', () => {
    const string = logger('this is [[string]]').toString()
    expect(typeof string).toBe('string')
  })
})
