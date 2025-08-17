import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NodeLogger, NodeStreamLogger } from '../../src/logger/node'
import { Logger, StreamLogger, createLogger, logger } from '../../src'
import type { Type } from '../../src/typings'
import { mockNodeEnvironment, testData, testStyles, validateLoggerOutput, measurePerformance, sleep } from '../shared/test-utils'

// Mock console for output capture
const mockConsole = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
}

describe('NodeLogger - Node.js Environment', () => {
  let originalConsole: typeof console
  let nodeEnv: ReturnType<typeof mockNodeEnvironment>

  beforeEach(() => {
    originalConsole = globalThis.console
    globalThis.console = mockConsole as any
    nodeEnv = mockNodeEnvironment()
    vi.clearAllMocks()
  })

  afterEach(() => {
    globalThis.console = originalConsole
    nodeEnv.restore()
  })

  describe('Basic Logger Operations', () => {
    it('should create NodeLogger instance', () => {
      const nodeLogger = new NodeLogger()
      expect(nodeLogger).toBeInstanceOf(NodeLogger)
      expect(nodeLogger.toString()).toBe('')
    })

    it('should handle basic text logging', () => {
      const nodeLogger = new NodeLogger()
      nodeLogger.text('Hello Node.js').print()
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should apply chalk styles in Node.js environment', async () => {
      const nodeLogger = new NodeLogger()
      const styledLogger = nodeLogger.text('Styled text', ['red', 'bold'])
      
      // Wait a bit for chalk to load if needed
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // The actual styling would be applied by chalk
      const output = styledLogger.toString()
      expect(output).toContain('Styled text')
      
      styledLogger.print()
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should handle prefix with styles', () => {
      const nodeLogger = new NodeLogger()
      nodeLogger.prefix('INFO', ['bgBlue']).text('Information message').print()
      expect(mockConsole.log).toHaveBeenCalled()
    })
  })

  describe('Static Factory Methods', () => {
    it('should create logger via static type method', () => {
      const infoLogger = NodeLogger.type('info')
      expect(infoLogger).toBeInstanceOf(NodeLogger)
      infoLogger.text('Info message').print()
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should create custom type logger', () => {
      const customLogger = NodeLogger.type('custom', ['bgMagenta', 'bold'])
      expect(customLogger).toBeInstanceOf(NodeLogger)
      customLogger.text('Custom message').print()
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should provide predefined logger types', () => {
      const loggers = [
        NodeLogger.info,
        NodeLogger.warn,
        NodeLogger.error,
        NodeLogger.debug,
        NodeLogger.success,
        NodeLogger.failure,
        NodeLogger.plain,
      ]

      loggers.forEach((logger, index) => {
        expect(logger).toBeInstanceOf(NodeLogger)
        logger.text(`Test message ${index}`).print()
      })

      expect(mockConsole.log).toHaveBeenCalledTimes(loggers.length)
    })
  })

  describe('Chalk Integration', () => {
    it('should handle chalk styles gracefully when chalk is available', () => {
      const nodeLogger = new NodeLogger()
      expect(() => {
        nodeLogger
          .text('Red bold text', ['red', 'bold'])
          .print()
      }).not.toThrow()
    })

    it('should handle non-existent chalk styles', () => {
      const nodeLogger = new NodeLogger()
      expect(() => {
        nodeLogger
          // @ts-expect-error: Testing non-existent style
          .text('Invalid style', ['nonExistentStyle'])
          .print()
      }).not.toThrow()
    })

    it('should handle complex style combinations', () => {
      const nodeLogger = new NodeLogger()
      expect(() => {
        nodeLogger
          .prefix('COMPLEX', ['bgRedBright', 'white', 'bold'])
          .text('Complex styled text', ['underline', 'italic'])
          .detail('Additional details', ['dim', 'gray'])
          .print()
      }).not.toThrow()
    })
  })

  describe('Logger Factory Integration', () => {
    it('should work with main logger export', () => {
      expect(() => {
        logger.info.text('Main logger test').print()
        logger.error.prefix('ERROR').text('Error message').print()
        logger.success.text('Success message').print()
      }).not.toThrow()

      expect(mockConsole.log).toHaveBeenCalledTimes(3)
    })

    it('should work with Logger class', () => {
      const customLogger = Logger.type('custom', ['bgCyan'])
      customLogger.text('Custom logger test').print()
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should work with createLogger function', () => {
      const typedLogger = createLogger<{
        nodeCustom: Type.CreateCustomType
      }>()

      expect(() => {
        typedLogger
          .nodeCustom(['bgGreen', 'black'])
          .prefix('NODE_CUSTOM')
          .text('Typed custom logger')
          .print()
      }).not.toThrow()
    })
  })

  describe('Performance in Node.js Environment', () => {
    it('should create logger instances efficiently', () => {
      const { duration } = measurePerformance(() => {
        for (let i = 0; i < 100; i++) {
          NodeLogger.type('perf_test')
        }
      })

      expect(duration).toBeLessThan(100) // Should be very fast
    })

    it('should handle large text efficiently', () => {
      const nodeLogger = new NodeLogger()
      const { duration } = measurePerformance(() => {
        nodeLogger.text(testData.longText).toString()
      })

      expect(duration).toBeLessThan(50)
    })

    it('should handle complex styling efficiently', () => {
      const { duration } = measurePerformance(() => {
        for (let i = 0; i < 50; i++) {
          NodeLogger.type(`perf_${i}`, ['bgRed', 'bold', 'underline'])
            .prefix(`PREFIX_${i}`)
            .text(`Performance test ${i}`)
            .detail(`Detail ${i}`)
            .toString()
        }
      })

      expect(duration).toBeLessThan(200)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty strings gracefully', () => {
      const nodeLogger = new NodeLogger()
      expect(() => {
        nodeLogger.prefix('').text('').detail('').print()
      }).not.toThrow()
    })

    it('should handle null and undefined data', () => {
      const nodeLogger = new NodeLogger()
      expect(() => {
        nodeLogger.data(null).print()
        nodeLogger.data(undefined).print()
      }).not.toThrow()
    })

    it('should handle unicode characters', () => {
      const nodeLogger = new NodeLogger()
      nodeLogger.text(testData.unicodeText).print()
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should handle very long text', () => {
      const nodeLogger = new NodeLogger()
      expect(() => {
        nodeLogger.text(testData.longText).print()
      }).not.toThrow()
    })
  })

  describe('Divider Operations', () => {
    it('should handle prepend dividers', () => {
      const nodeLogger = new NodeLogger()
      nodeLogger.prependDivider('=', 20).text('Message with prepend divider').print()
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should handle append dividers', () => {
      const nodeLogger = new NodeLogger()
      nodeLogger.text('Message with append divider').appendDivider('-', 15).print()
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should handle single dividers', () => {
      const nodeLogger = new NodeLogger()
      nodeLogger.divider('*', 25).print()
      expect(mockConsole.log).toHaveBeenCalled()
    })
  })

  describe('Time Display', () => {
    it('should include timestamp when enabled', () => {
      const nodeLogger = new NodeLogger()
      const timedLogger = nodeLogger.time(true).text('Timestamped message')
      
      const output = timedLogger.toString()
      expect(validateLoggerOutput(output).hasTimestamp()).toBe(true)
    })

    it('should exclude timestamp when disabled', () => {
      const nodeLogger = new NodeLogger()
      nodeLogger.time(false).text('Non-timestamped message').print()
      
      const output = nodeLogger.toString()
      expect(validateLoggerOutput(output).hasTimestamp()).toBe(false)
    })
  })
})

describe('NodeStreamLogger - Node.js Stream Logging', () => {
  let originalConsole: typeof console
  let nodeEnv: ReturnType<typeof mockNodeEnvironment>

  beforeEach(() => {
    originalConsole = globalThis.console
    globalThis.console = mockConsole as any
    nodeEnv = mockNodeEnvironment()
    vi.clearAllMocks()
  })

  afterEach(() => {
    globalThis.console = originalConsole
    nodeEnv.restore()
  })

  describe('Stream Logger Creation', () => {
    it('should create NodeStreamLogger instance', () => {
      const streamLogger = new NodeStreamLogger('STREAM')
      expect(streamLogger).toBeInstanceOf(NodeStreamLogger)
    })

    it('should create stream via NodeLogger.stream', () => {
      const stream = NodeLogger.stream
      expect(stream).toBeInstanceOf(NodeStreamLogger)
    })

    it('should create stream via toStream method', () => {
      const nodeLogger = new NodeLogger()
      const stream = nodeLogger.toStream('CONVERTED')
      expect(stream).toBeInstanceOf(NodeStreamLogger)
    })

    it('should work with main StreamLogger export', () => {
      const stream = new StreamLogger('MAIN_STREAM')
      expect(stream).toBeDefined()
    })
  })

  describe('Ora Integration', () => {
    it('should handle ora spinner initialization', async () => {
      const stream = new NodeStreamLogger('ORA_TEST')
      expect(() => {
        stream.initializeStream()
      }).not.toThrow()
    })

    it('should handle text updates with ora', async () => {
      const stream = new NodeStreamLogger('UPDATE_TEST')
      stream.initializeStream()
      
      expect(() => {
        stream.text('Initial text')
        stream.update()
        stream.text('Updated text')
        stream.update()
      }).not.toThrow()
    })

    it('should handle async updates', async () => {
      const stream = new NodeStreamLogger('ASYNC_TEST')
      stream.initializeStream()
      
      expect(async () => {
        await stream.asyncUpdate(10)
      }).not.toThrow()
    })
  })

  describe('Stream State Management', () => {
    it('should handle succeed state', async () => {
      const stream = new NodeStreamLogger('SUCCESS_TEST')
      stream.initializeStream()
      
      expect(() => {
        stream.succeed('Operation completed successfully')
      }).not.toThrow()
    })

    it('should handle fail state', async () => {
      const stream = new NodeStreamLogger('FAIL_TEST')
      stream.initializeStream()
      
      expect(() => {
        stream.fail('Operation failed')
      }).not.toThrow()
    })

    it('should handle start state', async () => {
      const stream = new NodeStreamLogger('START_TEST')
      stream.initializeStream()
      
      expect(() => {
        stream.start('Starting operation')
      }).not.toThrow()
    })

    it('should handle stop state', async () => {
      const stream = new NodeStreamLogger('STOP_TEST')
      stream.initializeStream()
      
      expect(() => {
        stream.stop('Stopping operation')
      }).not.toThrow()
    })
  })

  describe('Stream Logger Integration', () => {
    it('should work with logger.stream', () => {
      const stream = logger.stream
      expect(() => {
        stream
          .prefix('📦 INSTALL')
          .text('Installing packages...')
          .update()
      }).not.toThrow()
    })

    it('should maintain prefix across updates', () => {
      const stream = logger.stream
        .prefix('🔄 PROCESS', ['cyan', 'bold'])
        .text('Processing data...')

      const initialOutput = stream.toString()
      expect(initialOutput).toContain('🔄 PROCESS')
      expect(initialOutput).toContain('Processing data...')

      stream.text('Processing complete...')
      const updatedOutput = stream.toString()
      expect(updatedOutput).toContain('🔄 PROCESS')
      expect(updatedOutput).toContain('Processing complete...')
    })
  })

  describe('Stream Performance', () => {
    it('should handle rapid updates efficiently', async () => {
      const stream = new NodeStreamLogger('RAPID_TEST')
      stream.initializeStream()

      const { duration } = measurePerformance(() => {
        for (let i = 0; i < 50; i++) {
          stream.text(`Update ${i}`).update()
        }
      })

      expect(duration).toBeLessThan(500)
    })

    it('should handle async operations efficiently', async () => {
      const stream = new NodeStreamLogger('ASYNC_PERF')
      stream.initializeStream()

      const start = performance.now()
      await Promise.all([
        stream.asyncUpdate(5),
        stream.asyncUpdate(5),
        stream.asyncUpdate(5),
      ])
      const duration = performance.now() - start

      expect(duration).toBeLessThan(100)
    })
  })

  describe('Stream Error Handling', () => {
    it('should handle initialization errors gracefully', () => {
      const stream = new NodeStreamLogger('ERROR_TEST')
      expect(() => {
        stream.initializeStream()
        stream.initializeStream() // Double initialization
      }).not.toThrow()
    })

    it('should handle update errors gracefully', () => {
      const stream = new NodeStreamLogger('UPDATE_ERROR')
      expect(() => {
        stream.update() // Update without initialization
      }).not.toThrow()
    })

    it('should handle finalization errors gracefully', () => {
      const stream = new NodeStreamLogger('FINAL_ERROR')
      expect(() => {
        stream.succeed() // Finalize without initialization
      }).not.toThrow()
    })
  })

  describe('Stream Method Chaining', () => {
    it('should support method chaining', () => {
      const stream = new NodeStreamLogger('CHAIN_TEST')
      const result = stream
        .prefix('CHAINED')
        .text('Chained message')
        .detail('Chained detail')
        .delay(10)
        .state('start')

      expect(result).toBe(stream)
    })

    it('should maintain state across chained operations', () => {
      const stream = new NodeStreamLogger('STATE_CHAIN')
      stream
        .prefix('STATE', ['bgYellow'])
        .text('Initial state')
        .update()
        .text('Updated state')
        .succeed('Final state')

      const output = stream.toString()
      expect(output).toContain('STATE')
      expect(output).toContain('Final state')
    })
  })
})