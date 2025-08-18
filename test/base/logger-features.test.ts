import { describe, expect, it } from 'vitest'
import { Logger, StreamLogger, createLogger, logger } from '../../src'
import type { Type } from '../../src/typings'
import { createMockConsole } from '../shared/test-utils'

describe('logger Features and Functionality', () => {
  describe('core Logger Features', () => {
    it('should display logger details correctly', () => {
      const result = logger.info
        .prefix('DETAIL_TEST')
        .text('Main message content')
        .detail('Additional detail information')
        .toString()

      expect(result).toContain('DETAIL_TEST')
      expect(result).toContain('Main message content')
      expect(result).toContain('Additional detail information')
    })

    it('should handle complex prefix styling', () => {
      const result = logger.info
        .prefix('STYLED', ['bgRed', 'white', 'bold'])
        .text('Styled prefix test')
        .toString()

      expect(result).toContain('STYLED')
      expect(result).toContain('Styled prefix test')
    })

    it('should support method chaining fluently', () => {
      const result = logger.info
        .prefix('CHAIN')
        .text('Chained message')
        .detail('Chained detail')
        .time()
        .prependDivider('=')
        .appendDivider('-')
        .toString()

      expect(result).toContain('CHAIN')
      expect(result).toContain('Chained message')
      expect(result).toContain('Chained detail')
    })

    it('should reuse logger instances correctly', () => {
      const reusableLogger = Logger.type('info')
        .time()
        .prependDivider('♥', 3)

      // First usage
      const result1 = reusableLogger
        .prefix('LOVE')
        .text('the world')
        .toString()

      // Second usage - should work independently
      const result2 = reusableLogger
        .prefix('LOVE')
        .text('coding')
        .detail('with passion')
        .toString()

      expect(result1).toContain('LOVE')
      expect(result1).toContain('the world')
      expect(result2).toContain('LOVE')
      expect(result2).toContain('coding')
      expect(result2).toContain('with passion')

      // Results should be different
      expect(result1).not.toEqual(result2)
    })

    it('should handle data objects correctly', () => {
      const testObject = {
        name: 'Test Object',
        value: 42,
        nested: {
          array: [1, 2, 3],
          boolean: true,
        },
      }

      const result = logger.info
        .prefix('DATA_TEST')
        .text('Object data test')
        .data(testObject)
        .toString()

      expect(result).toContain('DATA_TEST')
      expect(result).toContain('Object data test')
    })

    it('should handle multiple data parameters correctly', () => {
      const result = logger.info
        .prefix('MULTI_DATA')
        .text('Multiple data test')
        .data([], 123, 'ok', {})
        .toString()

      expect(result).toContain('MULTI_DATA')
      expect(result).toContain('Multiple data test')
      expect(result).toContain('[]')
      expect(result).toContain('123')
      expect(result).toContain('ok')
      expect(result).toContain('{}')
    })

    it('should handle mixed data types in multiple parameters', () => {
      const testArray = [1, 2, 3]
      const testObject = { key: 'value', number: 42 }
      const testString = 'test string'
      const testNumber = 999
      const testBoolean = true
      const testNull = null
      const testUndefined = undefined

      const result = logger.info
        .prefix('MIXED_DATA')
        .text('Mixed data types test')
        .data(testArray, testObject, testString, testNumber, testBoolean, testNull, testUndefined)
        .toString()

      expect(result).toContain('MIXED_DATA')
      expect(result).toContain('Mixed data types test')
      // Check for array elements (formatted with pretty-printing)
      expect(result).toContain('1')
      expect(result).toContain('2')
      expect(result).toContain('3')
      expect(result).toContain('"key": "value"')
      expect(result).toContain('test string')
      expect(result).toContain('999')
      expect(result).toContain('true')
      expect(result).toContain('null')
      expect(result).toContain('undefined')
    })

    it('should maintain backward compatibility with single data parameter', () => {
      const testObject = { legacy: 'test' }
      
      const result = logger.info
        .prefix('LEGACY_DATA')
        .text('Legacy single data test')
        .data(testObject)
        .toString()

      expect(result).toContain('LEGACY_DATA')
      expect(result).toContain('Legacy single data test')
      expect(result).toContain('"legacy": "test"')
    })

    it('should handle empty data parameters gracefully', () => {
      const result = logger.info
        .prefix('EMPTY_DATA')
        .text('Empty data test')
        .data()
        .toString()

      expect(result).toContain('EMPTY_DATA')
      expect(result).toContain('Empty data test')
      // Should not contain any data section when no parameters are passed
    })

    it('should format each data item on separate lines', () => {
      const result = logger.info
        .prefix('FORMAT_TEST')
        .text('Data formatting test')
        .data('first', 'second', 'third')
        .toString()

      const lines = result.split('\n')
      const dataLines = lines.filter(line => line === 'first' || line === 'second' || line === 'third')
      
      expect(dataLines).toHaveLength(3)
      expect(dataLines[0]).toBe('first')
      expect(dataLines[1]).toBe('second')
      expect(dataLines[2]).toBe('third')
    })

    it('should handle time display correctly', () => {
      const result = logger.info
        .time()
        .prefix('TIME_TEST')
        .text('Time display test')
        .toString()

      expect(result).toContain('TIME_TEST')
      expect(result).toContain('Time display test')
      // Should contain time-related content (timestamp)
      expect(result.length).toBeGreaterThan('TIME_TEST Time display test'.length)
    })
  })

  describe('custom Type System', () => {
    it('should add custom types via type function', () => {
      const customLogger = Logger.type('custom', ['red', 'bold'])

      expect(customLogger).toBeInstanceOf(Logger)

      const result = customLogger
        .prefix('CUSTOM')
        .text('Custom type test')
        .toString()

      expect(result).toContain('CUSTOM')
      expect(result).toContain('Custom type test')
    })

    it('should add custom types via proxy', () => {
      // First register the type
      Logger.type('customProxy', ['blue', 'underline'])

      // Then access it via the proxy
      const customLogger = Logger.getLoggerInstance('customProxy')

      expect(customLogger).toBeDefined()

      const result = customLogger
        .prefix('PROXY')
        .text('Proxy type test')
        .toString()

      expect(result).toContain('PROXY')
      expect(result).toContain('Proxy type test')
    })

    it('should override preset types', () => {
      const overriddenLogger = logger.type('info', ['magenta', 'italic'])

      expect(overriddenLogger).toBeInstanceOf(Logger)

      const result = overriddenLogger
        .prefix('OVERRIDE')
        .text('Overridden info type')
        .toString()

      expect(result).toContain('OVERRIDE')
      expect(result).toContain('Overridden info type')
    })

    it('should handle TypeScript type system integration', () => {
      interface CustomTypes {
        apiCall: Type.CreateCustomType
        database: Type.CreateCustomType
        cache: Type.CreateCustomType
      }

      const typedLogger = createLogger<CustomTypes>()

      // Should not throw TypeScript errors - using the exact same pattern as the working test
      const apiResult = typedLogger
        .apiCall(['bgBlue', 'white'])
        .prefix('API')
        .text('Making API call')
        .toString()

      const dbResult = typedLogger
        .database(['bgGreen', 'white'])
        .prefix('DB')
        .text('Database query')
        .toString()

      const cacheResult = typedLogger
        .cache(['bgYellow', 'black'])
        .prefix('CACHE')
        .text('Cache operation')
        .toString()

      expect(apiResult).toContain('API')
      expect(apiResult).toContain('Making API call')
      expect(dbResult).toContain('DB')
      expect(dbResult).toContain('Database query')
      expect(cacheResult).toContain('CACHE')
      expect(cacheResult).toContain('Cache operation')
    })

    it('should handle empty style arrays', () => {
      expect(() => {
        const emptyStyleLogger = logger.type('empty', [])
        emptyStyleLogger.text('Empty styles test').toString()
      }).not.toThrow()
    })

    it('should handle invalid style names gracefully', () => {
      expect(() => {
        const invalidLogger = logger.type('invalid', [
          // @ts-expect-error: Testing invalid styles
          'nonExistentStyle',
          'anotherInvalidStyle',
        ])
        invalidLogger.text('Invalid styles test').toString()
      }).not.toThrow()
    })

    it('should handle duplicate type registration', () => {
      const logger1 = logger.type('duplicate', ['red'])
      const logger2 = logger.type('duplicate', ['blue'])

      expect(logger1).toBeInstanceOf(Logger)
      expect(logger2).toBeInstanceOf(Logger)
      expect(logger1).not.toBe(logger2)

      // Both should work independently
      expect(() => {
        logger1.text('First duplicate').toString()
        logger2.text('Second duplicate').toString()
      }).not.toThrow()
    })

    it('should handle very long type names', () => {
      const longTypeName = 'a'.repeat(100)

      expect(() => {
        const longNameLogger = logger.type(longTypeName, ['cyan'])
        longNameLogger.text('Long type name test').toString()
      }).not.toThrow()
    })
  })

  describe('divider Functionality', () => {
    it('should create prepend dividers correctly', () => {
      const result = logger.info
        .prependDivider('=', 20)
        .prefix('DIVIDER')
        .text('Prepend divider test')
        .toString()

      expect(result).toContain('DIVIDER')
      expect(result).toContain('Prepend divider test')
      expect(result).toContain('=')
    })

    it('should create append dividers correctly', () => {
      const result = logger.info
        .prefix('DIVIDER')
        .text('Append divider test')
        .appendDivider('-', 15)
        .toString()

      expect(result).toContain('DIVIDER')
      expect(result).toContain('Append divider test')
      expect(result).toContain('-')
    })

    it('should handle both prepend and append dividers', () => {
      const result = logger.info
        .prependDivider('*', 10)
        .prefix('BOTH')
        .text('Both dividers test')
        .appendDivider('#', 8)
        .toString()

      expect(result).toContain('BOTH')
      expect(result).toContain('Both dividers test')
      expect(result).toContain('*')
      expect(result).toContain('#')
    })

    it('should use default divider parameters', () => {
      const result = logger.info
        .prependDivider()
        .prefix('DEFAULT')
        .text('Default divider test')
        .appendDivider()
        .toString()

      expect(result).toContain('DEFAULT')
      expect(result).toContain('Default divider test')
    })

    it('should handle unicode divider characters', () => {
      const result = logger.info
        .prependDivider('🌟', 5)
        .prefix('UNICODE')
        .text('Unicode divider test')
        .appendDivider('⭐', 3)
        .toString()

      expect(result).toContain('UNICODE')
      expect(result).toContain('Unicode divider test')
      expect(result).toContain('🌟')
      expect(result).toContain('⭐')
    })
  })

  describe('style System', () => {
    it('should apply single styles correctly', () => {
      const result = logger.info
        .styles(['red'])
        .text('Single style test')
        .toString()

      expect(result).toContain('Single style test')
    })

    it('should apply multiple styles correctly', () => {
      const result = logger.info
        .styles(['red', 'bold', 'underline'])
        .text('Multiple styles test')
        .toString()

      expect(result).toContain('Multiple styles test')
    })

    it('should handle background and foreground combinations', () => {
      const result = logger.info
        .styles(['bgBlue', 'white', 'bold'])
        .text('Background and foreground test')
        .toString()

      expect(result).toContain('Background and foreground test')
    })

    it('should ignore non-existent styles gracefully', () => {
      expect(() => {
        const result = logger.info
          // @ts-expect-error: Testing non-existent styles
          .styles(['red', 'nonExistentStyle', 'bold'])
          .text('Mixed valid and invalid styles')
          .toString()

        expect(result).toContain('Mixed valid and invalid styles')
      }).not.toThrow()
    })

    it('should handle empty styles array', () => {
      expect(() => {
        const result = logger.info
          .styles([])
          .text('Empty styles test')
          .toString()

        expect(result).toContain('Empty styles test')
      }).not.toThrow()
    })
  })

  describe('streamLogger Features', () => {
    it('should create StreamLogger with prefix and styles', () => {
      const stream = new StreamLogger('STREAM', ['cyan', 'bold'])

      expect(stream).toBeInstanceOf(StreamLogger)

      const result = stream
        .text('Stream logger test')
        .toString()

      expect(result).toContain('Stream logger test')
    })

    it('should handle StreamLogger state changes', () => {
      const stream = new StreamLogger('STATE', ['green'])

      expect(() => {
        stream.state('start')
        stream.state('succeed')
        stream.state('fail')
        stream.state('stop')
      }).not.toThrow()
    })

    it('should support StreamLogger method chaining', () => {
      const stream = new StreamLogger('CHAIN', ['blue'])

      const result = stream
        .prefix('CHAINED')
        .text('Chained stream test')
        .detail('Stream detail')
        .delay(100)

      expect(result).toBe(stream)
    })

    it('should handle StreamLogger async operations', async () => {
      const stream = new StreamLogger('ASYNC', ['magenta'])

      await expect(async () => {
        await stream.asyncUpdate(10)
        stream.text('Async updated text')
      }).not.toThrow()
    })

    it('should create StreamLogger from logger.toStream', () => {
      const loggerInstance = logger('test')
      const stream = loggerInstance.toStream('TO_STREAM', ['yellow'])

      expect(stream).toBeDefined()

      const result = stream
        .text('Created from logger.toStream')
        .toString()

      expect(result).toContain('Created from logger.toStream')
    })

    it('should create StreamLogger from logger.stream', () => {
      const stream = logger.stream
        .prefix('LOGGER_STREAM', ['red'])

      expect(stream).toBeDefined()
      expect(typeof stream.text).toBe('function')
      expect(typeof stream.toString).toBe('function')

      const result = stream
        .text('Created from logger.stream')
        .toString()

      expect(result).toContain('Created from logger.stream')
    })
  })

  describe('output and Printing', () => {
    it('should convert to string without printing', () => {
      const result = logger.info
        .prefix('TO_STRING')
        .text('String conversion test')
        .detail('No console output')
        .toString()

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
      expect(result).toContain('TO_STRING')
      expect(result).toContain('String conversion test')
      expect(result).toContain('No console output')
    })

    it('should print to console when using print method', () => {
      const consoleMock = createMockConsole()
      const originalConsole = globalThis.console
      globalThis.console = consoleMock as any

      logger.info
        .prefix('PRINT_TEST')
        .text('Console print test')
        .print()

      expect(consoleMock.log).toHaveBeenCalled()
      globalThis.console = originalConsole
    })

    it('should handle complex output formatting', () => {
      const result = logger.info
        .time()
        .prependDivider('=', 30)
        .prefix('COMPLEX', ['bgRed', 'white', 'bold'])
        .text('Complex formatting test')
        .detail('With multiple components')
        .data({ test: true, value: 42 })
        .appendDivider('-', 20)
        .toString()

      expect(result).toContain('COMPLEX')
      expect(result).toContain('Complex formatting test')
      expect(result).toContain('With multiple components')
      expect(result).toContain('=')
      expect(result).toContain('-')
    })
  })

  describe('integration and Compatibility', () => {
    it('should work with all preset logger types', () => {
      const presetTypes = ['info', 'success', 'warn', 'error', 'debug']

      presetTypes.forEach((type) => {
        expect(() => {
          // @ts-expect-error: Dynamic type access for testing
          const result = logger[type]
            .prefix(type.toUpperCase())
            .text(`${type} type test`)
            .toString()

          expect(result).toContain(type.toUpperCase())
          expect(result).toContain(`${type} type test`)
        }).not.toThrow()
      })
    })

    it('should maintain logger instance independence', () => {
      const logger1 = logger.info.prefix('FIRST')
      const logger2 = logger.info.prefix('SECOND')

      expect(logger1).not.toBe(logger2)

      const result1 = logger1.text('First logger').toString()
      const result2 = logger2.text('Second logger').toString()

      expect(result1).toContain('FIRST')
      expect(result1).toContain('First logger')
      expect(result2).toContain('SECOND')
      expect(result2).toContain('Second logger')
      expect(result1).not.toEqual(result2)
    })

    it('should handle mixed usage patterns', () => {
      // Mix of static and instance methods
      const staticLogger = Logger.type('static', ['blue'])
      const instanceLogger = Logger.type('dynamic', ['green'])
      const streamLogger = new StreamLogger('STREAM', ['red'])

      expect(() => {
        staticLogger.text('Static usage').toString()
        instanceLogger.text('Instance usage').toString()
        streamLogger.text('Stream usage').toString()
      }).not.toThrow()
    })
  })
})
