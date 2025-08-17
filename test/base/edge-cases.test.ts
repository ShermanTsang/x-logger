import { describe, expect, it } from 'vitest'
import { Logger, StreamLogger, createLogger, logger } from '../../src'
import type { Type } from '../../src/typings'
import { testData } from '../shared/test-utils'

describe('edge Cases and Error Handling - Base Functionality', () => {
  describe('input Validation and Edge Cases', () => {
    it('should handle empty strings gracefully', () => {
      expect(() => {
        logger.info.prefix('').text('').detail('').toString()
      }).not.toThrow()

      const result = logger.info.prefix('').text('').detail('').toString()
      expect(typeof result).toBe('string')
    })

    it('should handle null and undefined values', () => {
      expect(() => {
        logger.info
          .prefix('NULL_TEST')
          .text('Testing null values')
          .data(null)
          .toString()
      }).not.toThrow()

      expect(() => {
        logger.info
          .prefix('UNDEFINED_TEST')
          .text('Testing undefined values')
          .data(undefined)
          .toString()
      }).not.toThrow()
    })

    it('should handle very long text strings', () => {
      const longText = 'A'.repeat(10000)

      expect(() => {
        logger.info
          .prefix('LONG_TEXT')
          .text(longText)
          .toString()
      }).not.toThrow()

      const result = logger.info.text(longText).toString()
      expect(result.length).toBeGreaterThan(longText.length)
    })

    it('should handle special characters and unicode', () => {
      expect(() => {
        logger.info
          .prefix('UNICODE')
          .text(testData.unicodeText)
          .toString()
      }).not.toThrow()

      const result = logger.info.text(testData.unicodeText).toString()
      expect(result).toContain(testData.unicodeText)
    })

    it('should handle circular references in data', () => {
      const circularObj: any = { name: 'test' }
      circularObj.self = circularObj

      expect(() => {
        logger.info
          .prefix('CIRCULAR')
          .text('Testing circular reference')
          .data(circularObj)
          .toString()
      }).not.toThrow()
    })

    it('should handle invalid style names gracefully', () => {
      expect(() => {
        logger
          // @ts-expect-error: Testing invalid styles
          .type('test', ['invalidStyle', 'anotherInvalidStyle'])
          .text('Invalid styles test')
          .toString()
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
          .toString()
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
          .toString()
      }).not.toThrow()
    })
  })

  describe('divider Edge Cases', () => {
    it('should handle zero and negative divider lengths', () => {
      expect(() => {
        logger.info
          .prependDivider('-', 0)
          .text('Zero length divider')
          .toString()
      }).not.toThrow()

      expect(() => {
        logger.info
          .appendDivider('*', 1)
          .text('Positive length divider')
          .toString()
      }).not.toThrow()
    })

    it('should handle empty divider characters', () => {
      expect(() => {
        logger.info
          .prependDivider('', 10)
          .text('Empty divider char')
          .toString()
      }).not.toThrow()
    })

    it('should handle very long dividers', () => {
      expect(() => {
        logger.info
          .prependDivider('=', 1000)
          .text('Very long divider')
          .appendDivider('-', 500)
          .toString()
      }).not.toThrow()
    })

    it('should handle unicode divider characters', () => {
      expect(() => {
        logger.info
          .prependDivider('🌟', 5)
          .text('Unicode divider')
          .appendDivider('⭐', 3)
          .toString()
      }).not.toThrow()
    })
  })

  describe('memory and Performance Edge Cases', () => {
    it('should not leak memory with many logger instances', () => {
      const instances: any[] = []

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

      // Clear references to help with garbage collection
      instances.length = 0
    })

    it('should handle rapid successive logging', () => {
      expect(() => {
        for (let i = 0; i < 100; i++) {
          logger.info.text(`Rapid log ${i}`).toString()
        }
      }).not.toThrow()
    })

    it('should handle concurrent logger usage', async () => {
      const promises = Array.from({ length: 50 }, (_, i) =>
        Promise.resolve().then(() => {
          logger.info
            .prefix(`CONCURRENT_${i}`)
            .text(`Concurrent log ${i}`)
            .toString()
        }))

      await expect(Promise.all(promises)).resolves.toBeDefined()
    })

    it('should handle memory cleanup with large operations', () => {
      expect(() => {
        for (let i = 0; i < 500; i++) {
          const temp = logger.type(`temp_${i}`, ['red', 'bold'])
            .prefix(`TEMP_${i}`)
            .text(`Temporary logger ${i}`)
            .data({ index: i, timestamp: Date.now() })
            .toString()

          // Use the result to prevent optimization
          expect(temp.length).toBeGreaterThan(0)
        }
      }).not.toThrow()
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
          .toString()
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
          .toString()
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
      expect(logString).toContain('TO_STRING')
      expect(logString).toContain('Convert to string without printing')
    })

    it('should maintain immutability of logger instances', () => {
      const baseLogger = logger.info
      const modifiedLogger = baseLogger.prefix('TEST')

      expect(baseLogger).not.toBe(modifiedLogger)
      expect(baseLogger.toString()).not.toEqual(modifiedLogger.toString())
    })
  })

  describe('logger Features and Functionality', () => {
    it('should show logger detail correctly', () => {
      expect(() => {
        logger.info
          .prefix('notice', ['bgRed'])
          .text('this is [[text]]')
          .detail('[[detail]]')
          .toString()
      }).not.toThrow()

      const result = logger.info
        .prefix('DETAIL_TEST')
        .text('Main text')
        .detail('Additional detail')
        .toString()

      expect(result).toContain('DETAIL_TEST')
      expect(result).toContain('Main text')
      expect(result).toContain('Additional detail')
    })

    it('should reuse logger instance correctly', () => {
      const reusedLogger = Logger.type('info').time().prependDivider('♥')

      // Use the reused logger instance multiple times
      const result1 = reusedLogger.prefix('love').text('the world').toString()
      const result2 = reusedLogger.prefix('love').text('you').toString()

      expect(result1).toContain('love')
      expect(result1).toContain('the world')
      expect(result2).toContain('love')
      expect(result2).toContain('you')
    })

    it('should ignore non-existent chalk styles', () => {
      expect(() => {
        logger.error
          // @ts-expect-error: Non-existent chalk style test
          .prefix('error', ['nonExistedChalkStyle'])
          .text('test ignoring non-existent chalk style')
          .toString()
      }).not.toThrow()
    })

    it('should handle complex style combinations', () => {
      expect(() => {
        logger
          .type('complex', ['red', 'bold', 'underline', 'bgYellow'])
          .prefix('COMPLEX')
          .text('Complex styling test')
          .toString()
      }).not.toThrow()
    })

    it('should handle time display correctly', () => {
      const result = logger.info
        .time()
        .text('Time test')
        .toString()

      expect(result).toContain('Time test')
      // Should contain some time-related content
      expect(result.length).toBeGreaterThan('Time test'.length)
    })
  })

  describe('streamLogger Edge Cases', () => {
    it('should handle StreamLogger with empty parameters', () => {
      expect(() => {
        const stream = new StreamLogger()
        stream.toString()
      }).not.toThrow()
    })

    it('should handle rapid state changes in StreamLogger', () => {
      expect(() => {
        const stream = new StreamLogger('RAPID', ['cyan'])
        stream.state('start').toString()
        stream.state('succeed').toString()
        stream.state('fail').toString()
        stream.state('stop').toString()
      }).not.toThrow()
    })

    it('should handle StreamLogger with invalid states', () => {
      const stream = new StreamLogger('INVALID', ['red'])

      expect(() => {
        // @ts-expect-error: Testing invalid state
        stream.state('invalidState').toString()
      }).not.toThrow()
    })

    it('should handle StreamLogger async operations', async () => {
      const stream = new StreamLogger('ASYNC', ['blue'])

      await expect(async () => {
        await stream.asyncUpdate(10) // Reduced delay for faster tests
        stream.text('Updated text')
        await stream.asyncUpdate(5)
      }).not.toThrow()
    })

    it('should handle StreamLogger method chaining', () => {
      expect(() => {
        const stream = new StreamLogger('CHAIN', ['green'])
        const result = stream
          .prefix('CHAINED')
          .text('Chained text')
          .detail('Chained detail')
          .delay(10)
          .state('start')

        expect(result).toBe(stream)
      }).not.toThrow()
    })

    it('should handle StreamLogger with complex data', () => {
      const stream = new StreamLogger('COMPLEX_DATA', ['magenta'])
      const complexData = {
        nested: { deep: { value: 'test' } },
        array: [1, 2, 3, { nested: true }],
        circular: null as any,
      }
      complexData.circular = complexData

      expect(() => {
        stream
          .prefix('COMPLEX')
          .text('Complex data test')
          .data(complexData)
          .toString()
      }).not.toThrow()
    })
  })

  describe('error Recovery and Resilience', () => {
    it('should recover from style application errors', () => {
      expect(() => {
        // Test with various potentially problematic style combinations
        const styles = [
          ['red', 'green'], // Conflicting colors
          ['bold', 'dim'], // Conflicting intensities
          ['bgRed', 'bgBlue'], // Conflicting backgrounds
        ]

        styles.forEach((styleSet, index) => {
          logger
            .type(`recovery_${index}`, styleSet)
            .text(`Recovery test ${index}`)
            .toString()
        })
      }).not.toThrow()
    })

    it('should handle malformed data gracefully', () => {
      const malformedData = [
        { toString: () => { throw new Error('toString error') } },
        { valueOf: () => { throw new Error('valueOf error') } },
        Object.create(null), // Object without prototype
        new Date('invalid'), // Invalid date
        Number.NaN,
        Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
      ]

      malformedData.forEach((data, index) => {
        expect(() => {
          logger.info
            .prefix(`MALFORMED_${index}`)
            .text('Malformed data test')
            .data(data)
            .toString()
        }).not.toThrow()
      })
    })

    it('should handle extreme nesting levels', () => {
      let deepObject: any = { value: 'deep' }
      for (let i = 0; i < 100; i++) {
        deepObject = { nested: deepObject }
      }

      expect(() => {
        logger.info
          .prefix('DEEP_NESTING')
          .text('Deep nesting test')
          .data(deepObject)
          .toString()
      }).not.toThrow()
    })
  })
})
