import { describe, expect, it } from 'vitest'
import { logger } from '../src/index'

describe('basic logger usage', () => {
  it('access polymorphic logger', () => {
    expect(() => {
      logger('anything you wanna put here').print()
      logger.info.prefix('OKAY').text('test').print()
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
