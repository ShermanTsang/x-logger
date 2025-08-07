import { describe, expect, it } from 'vitest'
import { Logger, logger } from '../src/index'

describe('logger features', () => {
  it('show logger detail', () => {
    expect(() =>
      logger.info
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
})
