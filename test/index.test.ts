import { describe, expect, it } from 'vitest'
import type { Logger as LoggerType } from '../src'
import { Logger, StreamLogger } from '../src'
import { createLogger, logger } from '../src/index'
import type { Type } from '../src/typings'

describe('logger', () => {
  it('access polymorphic logger', () => {
    expect(() => {
      logger('anything you wanna put here').print()
      logger.info.prefix('OKAY').text('test').print()
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
      .prefix('custom logger')
      .text('test adding custom logger type via type function')
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
      .prefix('custom logger')
      .text('test adding custom logger type via proxy function')
      .print()

    // Use the type function to add and use the custom logger type
    logger
      .type('newType')
      .prefix('custom logger')
      .text('The next time you can use `newType` with `type` function')
      .print()

    // Not recommended style: directly using the new type
    const customLoggerType = logger.newType as unknown as LoggerType
    customLoggerType
      .prefix('custom logger')
      .text('Also, you can use `newType` directly, but not recommend')
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
      .prefix('info')
      .text('test overriding preset logger type')
      .prependDivider()
      .print()
  })

  it('show logger detail', () => {
    expect(() => logger.info
      .prefix('notice', ['bgRed'])
      .text('this is [[text]]')
      .detail('[[detail]]')
      .print(),
    ).not.toThrow()
  })

  it('reuse logger instance', () => {
    const reusedLogger = Logger.type('info').time().prependDivider('♥')

    // Use the reused logger instance to print multiple texts
    reusedLogger.prefix('love').text('the world').print()
    reusedLogger.prefix('love').text('you').print()
  })

  it('ignore non-existed chalk style', () => {
    expect(() => {
      logger.error
      // @ts-expect-error: Non-existed chalk style test
        .prefix('error', ['nonExistedChalkStyle'])
        .text('test ignoring non-existed chalk style')
        .print()
    }).not.toThrow()
  })

  it('transform to string', () => {
    const rawText = 'this is [[string]]'
    const string = logger(rawText).toString()
    expect(string !== rawText).toBe(true)
    expect(typeof string).toBe('string')
  })

  it('show only single divider', () => {
    logger.info.divider('-')
    expect(logger.info.prependDivider().toString().split('\n').length).toBe(1)
  })
})

describe('stream logger', () => {
  it('create stream logger via new StreamLogger', async () => {
    const streamLogger1 = new StreamLogger('❤️ streamLogger1', ['underline'])
    streamLogger1.text('create via new StreamLogger', ['gray']).update()
  })

  it('create stream logger via Logger.toStream', async () => {
    const streamLogger2 = (new Logger()).toStream('❤️ streamLogger2', ['underline'])
    streamLogger2.text('create via Logger.toStream', ['gray']).update()
  })

  it('create stream logger via logger.stream', async () => {
    const streamLogger3 = logger.stream
    streamLogger3.prefix('❤️ streamLogger3', ['underline']).text('create via logger.stream', ['gray']).update()
  })
})
