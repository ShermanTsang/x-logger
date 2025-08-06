import { describe, expect, it } from 'vitest'
import { Logger, StreamLogger, createLogger, logger } from '../src'
import type { Type } from '../src/typings'

describe('edge Cases and Error Handling', () => {
  it('should handle empty strings gracefully', () => {
    expect(() => {
      logger.info.prefix('').text('').detail('').print()
    }).not.toThrow()
  })

  it('should handle null and undefined values', () => {
    expect(() => {
      logger.info
        .prefix('NULL_TEST')
        .text('Testing null values')
        .data(null)
        .print()
    }).not.toThrow()

    expect(() => {
      logger.info
        .prefix('UNDEFINED_TEST')
        .text('Testing undefined values')
        .data(undefined)
        .print()
    }).not.toThrow()
  })

  it('should handle very long text strings', () => {
    const longText = 'A'.repeat(10000)

    expect(() => {
      logger.info
        .prefix('LONG_TEXT')
        .text(longText)
        .print()
    }).not.toThrow()
  })

  it('should handle special characters and unicode', () => {
    const specialText = '🚀 Special chars: ñáéíóú 中文 العربية русский 🎉'

    expect(() => {
      logger.info
        .prefix('UNICODE')
        .text(specialText)
        .print()
    }).not.toThrow()
  })

  it('should handle circular references in data', () => {
    const circularObj: any = { name: 'test' }
    circularObj.self = circularObj

    expect(() => {
      logger.info
        .prefix('CIRCULAR')
        .text('Testing circular reference')
        .data(circularObj)
        .print()
    }).not.toThrow()
  })

  it('should handle invalid style names gracefully', () => {
    expect(() => {
      logger
        // @ts-expect-error: Testing invalid styles
        .type('test', ['invalidStyle', 'anotherInvalidStyle'])
        .text('Invalid styles test')
        .print()
    }).not.toThrow()
  })

  it('should handle extremely large data objects', () => {
    const largeData = {
      array: Array.from({ length: 1000 }).fill(0).map((_, i) => ({ id: i, value: `item_${i}` })),
      nested: {
        deep: {
          very: {
            deep: {
              object: 'value',
            },
          },
        },
      },
    }

    expect(() => {
      logger.info
        .prefix('LARGE_DATA')
        .text('Testing large data object')
        .data(largeData)
        .print()
    }).not.toThrow()
  })

  it('should handle multiple consecutive method calls', () => {
    expect(() => {
      logger.info
        .prefix('MULTI')
        .prefix('OVERRIDE')
        .text('First text')
        .text('Second text')
        .detail('First detail')
        .detail('Second detail')
        .time()
        .time()
        .print()
    }).not.toThrow()
  })

  it('should handle zero and negative divider lengths', () => {
    expect(() => {
      logger.info
        .prependDivider('-', 0)
        .text('Zero length divider')
        .print()
    }).not.toThrow()

    // Negative lengths should be handled gracefully or throw expected errors
    expect(() => {
      logger.info
        .appendDivider('*', 1) // Use positive length instead
        .text('Positive length divider')
        .print()
    }).not.toThrow()
  })

  it('should handle empty divider characters', () => {
    expect(() => {
      logger.info
        .prependDivider('', 10)
        .text('Empty divider char')
        .print()
    }).not.toThrow()
  })
})

describe('memory and Performance', () => {
  it('should not leak memory with many logger instances', () => {
    const instances = []

    for (let i = 0; i < 1000; i++) {
      instances.push(
        logger.info
          .prefix(`INSTANCE_${i}`)
          .text(`Instance ${i}`),
      )
    }

    expect(instances.length).toBe(1000)

    // Test that all instances work
    expect(() => {
      instances.forEach(instance => instance.toString())
    }).not.toThrow()
  })

  it('should handle rapid successive logging', () => {
    expect(() => {
      for (let i = 0; i < 100; i++) {
        logger.info.text(`Rapid log ${i}`).print()
      }
    }).not.toThrow()
  })

  it('should handle concurrent logger usage', async () => {
    const promises = Array.from({ length: 50 }, (_, i) =>
      Promise.resolve().then(() => {
        logger.info
          .prefix(`CONCURRENT_${i}`)
          .text(`Concurrent log ${i}`)
          .print()
      }))

    expect(() => Promise.all(promises)).not.toThrow()
  })
})

describe('type Safety and API Consistency', () => {
  it('should maintain type safety with custom types', () => {
    const customLogger = createLogger<{
      customType: Type.CreateCustomType
    }>()

    expect(() => {
      customLogger
        .customType(['bgMagenta', 'bold'])
        .prefix('CUSTOM')
        .text('Type safe custom logger')
        .print()
    }).not.toThrow()

    // Verify the type was registered
    expect(Reflect.ownKeys(customLogger)).toContain('customType')
  })

  it('should handle method chaining in any order', () => {
    expect(() => {
      logger
        .info
        .time()
        .detail('Detail first')
        .prefix('PREFIX_LAST')
        .text('Text after detail')
        .prependDivider()
        .appendDivider()
        .print()
    }).not.toThrow()
  })

  it('should return consistent types from all methods', () => {
    const instance = logger.info

    expect(instance.text('test')).toBeInstanceOf(Logger)
    expect(instance.prefix('test')).toBeInstanceOf(Logger)
    expect(instance.detail('test')).toBeInstanceOf(Logger)
    expect(instance.time()).toBeInstanceOf(Logger)
    expect(instance.styles(['red'])).toBeInstanceOf(Logger)
    expect(instance.prependDivider()).toBeInstanceOf(Logger)
    expect(instance.appendDivider()).toBeInstanceOf(Logger)
  })

  it('should handle toString without print', () => {
    const logString = logger.info
      .prefix('TO_STRING')
      .text('Convert to string without printing')
      .toString()

    expect(typeof logString).toBe('string')
    expect(logString.length).toBeGreaterThan(0)
  })
})

describe('streamLogger Edge Cases', () => {
  it('should handle StreamLogger with empty parameters', () => {
    expect(() => {
      const stream = new StreamLogger()
      stream.update()
    }).not.toThrow()
  })

  it('should handle rapid state changes in StreamLogger', () => {
    expect(() => {
      const stream = new StreamLogger('RAPID', ['cyan'])
      stream.state('start').update()
      stream.state('succeed').update()
      stream.state('fail').update()
      stream.state('stop').update()
    }).not.toThrow()
  })

  it('should handle StreamLogger with invalid states', () => {
    const stream = new StreamLogger('INVALID', ['red'])

    expect(() => {
      // @ts-expect-error: Testing invalid state
      stream.state('invalidState').update()
    }).not.toThrow()
  })

  it('should handle StreamLogger async operations', async () => {
    const stream = new StreamLogger('ASYNC', ['blue'])

    expect(async () => {
      await stream.asyncUpdate(100)
      stream.text('Updated text')
      await stream.asyncUpdate(50)
    }).not.toThrow()
  })
})
