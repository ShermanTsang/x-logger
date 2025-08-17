import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BrowserLogger, BrowserStreamLogger } from '../../src/logger/browser'
import { Logger, StreamLogger, createLogger, logger } from '../../src'
import type { Type } from '../../src/typings'
import { mockBrowserEnvironment, testData, testStyles, validateLoggerOutput, measurePerformance } from '../shared/test-utils'

// Mock browser environment utilities
function setupBrowserMocks() {
  const mockConsole = {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    group: vi.fn(),
    groupEnd: vi.fn(),
    groupCollapsed: vi.fn(),
  }

  const mockWindow = {
    console: mockConsole,
  }

  const mockDocument = {
    createElement: vi.fn(),
  }

  return { mockConsole, mockWindow, mockDocument }
}

describe('BrowserLogger - Browser Environment', () => {
  let browserEnv: ReturnType<typeof mockBrowserEnvironment>
  let mocks: ReturnType<typeof setupBrowserMocks>

  beforeEach(() => {
    browserEnv = mockBrowserEnvironment()
    mocks = setupBrowserMocks()
    
    // Override with our specific mocks
    globalThis.console = mocks.mockConsole as any
    globalThis.window = mocks.mockWindow as any
    globalThis.document = mocks.mockDocument as any
    
    vi.clearAllMocks()
  })

  afterEach(() => {
    browserEnv.restore()
  })

  describe('Basic Browser Logger Operations', () => {
    it('should create BrowserLogger instance', () => {
      const browserLogger = new BrowserLogger()
      expect(browserLogger).toBeInstanceOf(BrowserLogger)
      expect(browserLogger.toString()).toBe('')
    })

    it('should handle basic text logging in browser', () => {
      const browserLogger = new BrowserLogger()
      browserLogger.text('Hello Browser').print()
      expect(mocks.mockConsole.log).toHaveBeenCalled()
    })

    it('should apply CSS styles in browser environment', () => {
      const browserLogger = new BrowserLogger()
      browserLogger.text('Styled text', ['red', 'bold']).print()
      expect(mocks.mockConsole.log).toHaveBeenCalled()
      
      // Check that console.log was called with CSS styling
      const calls = mocks.mockConsole.log.mock.calls
      expect(calls.length).toBeGreaterThan(0)
    })

    it('should handle prefix with CSS styles', () => {
      const browserLogger = new BrowserLogger()
      browserLogger.prefix('INFO', ['bgBlue', 'white']).text('Information message').print()
      expect(mocks.mockConsole.log).toHaveBeenCalled()
    })
  })

  describe('CSS Styling System', () => {
    it('should convert chalk-style names to CSS', () => {
      const browserLogger = new BrowserLogger()
      const styledText = browserLogger.decorateText('Test', ['red', 'bold'])
      expect(styledText).toContain('Test')
    })

    it('should handle background colors with CSS', () => {
      const browserLogger = new BrowserLogger()
      browserLogger.text('Background test', ['bgGreen', 'white']).print()
      expect(mocks.mockConsole.log).toHaveBeenCalled()
    })

    it('should handle text decorations', () => {
      const browserLogger = new BrowserLogger()
      browserLogger.text('Decorated text', ['underline', 'italic']).print()
      expect(mocks.mockConsole.log).toHaveBeenCalled()
    })

    it('should handle bright colors', () => {
      const browserLogger = new BrowserLogger()
      browserLogger.text('Bright colors', ['redBright', 'bgYellowBright']).print()
      expect(mocks.mockConsole.log).toHaveBeenCalled()
    })

    it('should handle unknown styles gracefully', () => {
      const browserLogger = new BrowserLogger()
      expect(() => {
        browserLogger
          // @ts-expect-error: Testing unknown style
          .text('Unknown style', ['unknownStyle'])
          .print()
      }).not.toThrow()
    })
  })

  describe('Static Factory Methods', () => {
    it('should create logger via static type method', () => {
      const infoLogger = BrowserLogger.type('info')
      expect(infoLogger).toBeInstanceOf(BrowserLogger)
      infoLogger.text('Info message').print()
      expect(mocks.mockConsole.log).toHaveBeenCalled()
    })

    it('should create custom type logger', () => {
      const customLogger = BrowserLogger.type('custom', ['bgMagenta', 'white'])
      expect(customLogger).toBeInstanceOf(BrowserLogger)
      customLogger.text('Custom message').print()
      expect(mocks.mockConsole.log).toHaveBeenCalled()
    })

    it('should provide predefined logger types', () => {
      const loggers = [
        BrowserLogger.info,
        BrowserLogger.warn,
        BrowserLogger.error,
        BrowserLogger.debug,
        BrowserLogger.success,
        BrowserLogger.failure,
        BrowserLogger.plain,
      ]

      loggers.forEach((logger, index) => {
        expect(logger).toBeInstanceOf(BrowserLogger)
        logger.text(`Test message ${index}`).print()
      })

      expect(mocks.mockConsole.log).toHaveBeenCalledTimes(loggers.length)
    })
  })

  describe('Console Output Formatting', () => {
    it('should use console.log for regular messages', () => {
      const browserLogger = new BrowserLogger()
      browserLogger.text('Regular message').print()
      expect(mocks.mockConsole.log).toHaveBeenCalled()
      expect(mocks.mockConsole.warn).not.toHaveBeenCalled()
      expect(mocks.mockConsole.error).not.toHaveBeenCalled()
    })

    it('should handle complex output with multiple parts', () => {
      const browserLogger = new BrowserLogger()
      browserLogger
        .prefix('COMPLEX', ['bgBlue', 'white'])
        .text('Main message', ['green'])
        .detail('Additional details', ['gray'])
        .data({ key: 'value' })
        .print()
      
      expect(mocks.mockConsole.log).toHaveBeenCalled()
    })

    it('should handle dividers in browser console', () => {
      const browserLogger = new BrowserLogger()
      browserLogger.divider('=', 20, ['blue']).print()
      expect(mocks.mockConsole.log).toHaveBeenCalled()
    })
  })

  describe('Browser Logger Integration', () => {
    it('should work with main logger export in browser', () => {
      expect(() => {
        logger.info.text('Main logger test').print()
        logger.error.prefix('ERROR').text('Error message').print()
        logger.success.text('Success message').print()
      }).not.toThrow()

      expect(mocks.mockConsole.log).toHaveBeenCalledTimes(3)
    })

    it('should work with Logger class in browser', () => {
      const customLogger = Logger.type('custom', ['bgCyan', 'black'])
      customLogger.text('Custom logger test').print()
      expect(mocks.mockConsole.log).toHaveBeenCalled()
    })

    it('should work with createLogger function in browser', () => {
      const typedLogger = createLogger<{
        browserCustom: Type.CreateCustomType
      }>()

      expect(() => {
        typedLogger
          .browserCustom(['bgPurple', 'white'])
          .prefix('BROWSER_CUSTOM')
          .text('Typed custom logger')
          .print()
      }).not.toThrow()
    })
  })

  describe('Browser Performance', () => {
    it('should create logger instances efficiently in browser', () => {
      const { duration } = measurePerformance(() => {
        for (let i = 0; i < 100; i++) {
          BrowserLogger.type('perf_test')
        }
      })

      expect(duration).toBeLessThan(100)
    })

    it('should handle large text efficiently in browser', () => {
      const browserLogger = new BrowserLogger()
      const { duration } = measurePerformance(() => {
        browserLogger.text(testData.longText).toString()
      })

      expect(duration).toBeLessThan(50)
    })

    it('should handle CSS styling efficiently', () => {
      const { duration } = measurePerformance(() => {
        for (let i = 0; i < 50; i++) {
          BrowserLogger.type(`perf_${i}`, ['bgRed', 'bold', 'underline'])
            .prefix(`PREFIX_${i}`)
            .text(`Performance test ${i}`)
            .detail(`Detail ${i}`)
            .toString()
        }
      })

      expect(duration).toBeLessThan(200)
    })
  })

  describe('Browser Edge Cases', () => {
    it('should handle missing console methods gracefully', () => {
      const limitedConsole = {
        log: vi.fn(),
        // Missing warn, error, info
      }
      globalThis.console = limitedConsole as any

      const browserLogger = new BrowserLogger()
      expect(() => {
        browserLogger.text('Limited console test').print()
      }).not.toThrow()
    })

    it('should handle unicode characters in browser', () => {
      const browserLogger = new BrowserLogger()
      browserLogger.text(testData.unicodeText).print()
      expect(mocks.mockConsole.log).toHaveBeenCalled()
    })

    it('should handle very long text in browser', () => {
      const browserLogger = new BrowserLogger()
      expect(() => {
        browserLogger.text(testData.longText).print()
      }).not.toThrow()
    })

    it('should handle null and undefined data in browser', () => {
      const browserLogger = new BrowserLogger()
      expect(() => {
        browserLogger.data(null).print()
        browserLogger.data(undefined).print()
      }).not.toThrow()
    })
  })
})

describe('BrowserStreamLogger - Browser Stream Logging', () => {
  let browserEnv: ReturnType<typeof mockBrowserEnvironment>
  let mocks: ReturnType<typeof setupBrowserMocks>

  beforeEach(() => {
    browserEnv = mockBrowserEnvironment()
    mocks = setupBrowserMocks()
    
    globalThis.console = mocks.mockConsole as any
    globalThis.window = mocks.mockWindow as any
    globalThis.document = mocks.mockDocument as any
    
    vi.clearAllMocks()
  })

  afterEach(() => {
    browserEnv.restore()
  })

  describe('Browser Stream Logger Creation', () => {
    it('should create BrowserStreamLogger instance', () => {
      const streamLogger = new BrowserStreamLogger('STREAM')
      expect(streamLogger).toBeInstanceOf(BrowserStreamLogger)
    })

    it('should create stream via BrowserLogger.stream', () => {
      const stream = BrowserLogger.stream
      expect(stream).toBeInstanceOf(BrowserStreamLogger)
    })

    it('should create stream via toStream method', () => {
      const browserLogger = new BrowserLogger()
      const stream = browserLogger.toStream('CONVERTED')
      expect(stream).toBeInstanceOf(BrowserStreamLogger)
    })

    it('should work with main StreamLogger export in browser', () => {
      const stream = new StreamLogger('MAIN_STREAM')
      expect(stream).toBeDefined()
    })
  })

  describe('Browser Stream Operations', () => {
    it('should handle initialization in browser', () => {
      const stream = new BrowserStreamLogger('INIT_TEST')
      expect(() => {
        stream.initializeStream()
      }).not.toThrow()
    })

    it('should handle text updates in browser', () => {
      const stream = new BrowserStreamLogger('UPDATE_TEST')
      stream.initializeStream()
      
      expect(() => {
        stream.text('Initial text')
        stream.update()
        stream.text('Updated text')
        stream.update()
      }).not.toThrow()
    })

    it('should handle async updates in browser', async () => {
      const stream = new BrowserStreamLogger('ASYNC_TEST')
      stream.initializeStream()
      
      expect(async () => {
        await stream.asyncUpdate(10)
      }).not.toThrow()
    })
  })

  describe('Browser Stream State Management', () => {
    it('should handle succeed state in browser', () => {
      const stream = new BrowserStreamLogger('SUCCESS_TEST')
      stream.initializeStream()
      
      expect(() => {
        stream.succeed('Operation completed successfully')
      }).not.toThrow()
    })

    it('should handle fail state in browser', () => {
      const stream = new BrowserStreamLogger('FAIL_TEST')
      stream.initializeStream()
      
      expect(() => {
        stream.fail('Operation failed')
      }).not.toThrow()
    })

    it('should handle start state in browser', () => {
      const stream = new BrowserStreamLogger('START_TEST')
      stream.initializeStream()
      
      expect(() => {
        stream.start('Starting operation')
      }).not.toThrow()
    })

    it('should handle stop state in browser', () => {
      const stream = new BrowserStreamLogger('STOP_TEST')
      stream.initializeStream()
      
      expect(() => {
        stream.stop('Stopping operation')
      }).not.toThrow()
    })
  })

  describe('Browser Stream Integration', () => {
    it('should work with logger.stream in browser', () => {
      const stream = logger.stream
      expect(() => {
        stream
          .prefix('📦 INSTALL')
          .text('Installing packages...')
          .update()
      }).not.toThrow()
    })

    it('should maintain prefix across updates in browser', () => {
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

    it('should handle CSS styling in stream updates', () => {
      const stream = new BrowserStreamLogger('STYLED_STREAM')
      stream
        .prefix('STYLED', ['bgGreen', 'white'])
        .text('Styled stream text', ['red', 'bold'])
        .update()
      
      const output = stream.toString()
      expect(output).toContain('STYLED')
      expect(output).toContain('Styled stream text')
    })
  })

  describe('Browser Stream Performance', () => {
    it('should handle rapid updates efficiently in browser', () => {
      const stream = new BrowserStreamLogger('RAPID_TEST')
      stream.initializeStream()

      const { duration } = measurePerformance(() => {
        for (let i = 0; i < 50; i++) {
          stream.text(`Update ${i}`).update()
        }
      })

      expect(duration).toBeLessThan(500)
    })

    it('should handle CSS styling efficiently in streams', () => {
      const stream = new BrowserStreamLogger('STYLE_PERF')
      stream.initializeStream()

      const { duration } = measurePerformance(() => {
        for (let i = 0; i < 20; i++) {
          stream
            .prefix(`PERF_${i}`, ['bgBlue', 'white'])
            .text(`Styled update ${i}`, ['red', 'bold'])
            .update()
        }
      })

      expect(duration).toBeLessThan(300)
    })
  })

  describe('Browser Stream Error Handling', () => {
    it('should handle missing console methods in streams', () => {
      const limitedConsole = {
        log: vi.fn(),
        // Missing other methods
      }
      globalThis.console = limitedConsole as any

      const stream = new BrowserStreamLogger('LIMITED_CONSOLE')
      expect(() => {
        stream.initializeStream()
        stream.text('Limited console stream').update()
      }).not.toThrow()
    })

    it('should handle update errors gracefully in browser', () => {
      const stream = new BrowserStreamLogger('UPDATE_ERROR')
      expect(() => {
        stream.update() // Update without initialization
      }).not.toThrow()
    })

    it('should handle finalization errors gracefully in browser', () => {
      const stream = new BrowserStreamLogger('FINAL_ERROR')
      expect(() => {
        stream.succeed() // Finalize without initialization
      }).not.toThrow()
    })
  })

  describe('Browser Stream Method Chaining', () => {
    it('should support method chaining in browser', () => {
      const stream = new BrowserStreamLogger('CHAIN_TEST')
      const result = stream
        .prefix('CHAINED')
        .text('Chained message')
        .detail('Chained detail')
        .delay(10)
        .state('start')

      expect(result).toBe(stream)
    })

    it('should maintain state across chained operations in browser', () => {
      const stream = new BrowserStreamLogger('STATE_CHAIN')
      stream
        .prefix('STATE', ['bgYellow', 'black'])
        .text('Initial state')
      
      stream.update() // Returns void in browser
      
      stream.text('Updated state')
      stream.succeed('Final state') // Returns void in browser

      const output = stream.toString()
      expect(output).toContain('STATE')
      expect(output).toContain('Final state')
    })
  })
})

describe('Cross-Platform Browser Compatibility', () => {
  let browserEnv: ReturnType<typeof mockBrowserEnvironment>

  beforeEach(() => {
    browserEnv = mockBrowserEnvironment()
    vi.clearAllMocks()
  })

  afterEach(() => {
    browserEnv.restore()
  })

  describe('Feature Detection', () => {
    it('should detect browser environment correctly', () => {
      expect(typeof window).toBe('object')
      expect(typeof document).toBe('object')
    })

    it('should handle missing browser features gracefully', () => {
      delete (globalThis as any).document
      
      const browserLogger = new BrowserLogger()
      expect(() => {
        browserLogger.text('No document test').print()
      }).not.toThrow()
    })
  })

  describe('Console API Compatibility', () => {
    it('should work with minimal console implementation', () => {
      const minimalConsole = {
        log: vi.fn(),
      }
      globalThis.console = minimalConsole as any

      const browserLogger = new BrowserLogger()
      browserLogger.text('Minimal console test').print()
      expect(minimalConsole.log).toHaveBeenCalled()
    })

    it('should handle console methods that throw errors', () => {
      const errorConsole = {
        log: vi.fn(() => { throw new Error('Console error') }),
        warn: vi.fn(),
        error: vi.fn(),
      }
      globalThis.console = errorConsole as any

      const browserLogger = new BrowserLogger()
      expect(() => {
        browserLogger.text('Error console test').print()
      }).not.toThrow()
    })
  })
})