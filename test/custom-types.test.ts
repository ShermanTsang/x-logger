import { describe, expect, it } from 'vitest'
import type { Logger as LoggerType } from '../src'
import { createLogger, logger } from '../src/index'
import type { Type } from '../src/typings'

describe('custom logger types', () => {
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
})
