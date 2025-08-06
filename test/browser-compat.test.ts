import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StreamLogger, logger } from '../src'

// Mock browser environment
const mockConsole = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
}

describe('browser Compatibility', () => {
  let originalConsole: typeof console
  let originalWindow: any
  let originalDocument: any

  beforeEach(() => {
    originalConsole = globalThis.console
    originalWindow = globalThis.window
    originalDocument = globalThis.document

    // Mock browser environment
    globalThis.console = mockConsole as any
    globalThis.window = {} as any
    globalThis.document = {} as any

    // Clear mock calls
    vi.clearAllMocks()
  })

  afterEach(() => {
    globalThis.console = originalConsole
    globalThis.window = originalWindow
    globalThis.document = originalDocument
  })

  it('should work in browser environment without chalk', () => {
    expect(() => {
      logger.info.text('Browser test').print()
    }).not.toThrow()

    expect(mockConsole.log).toHaveBeenCalled()
  })

  it('should handle styling gracefully in browser', () => {
    expect(() => {
      logger
        .type('custom', ['bgRed', 'bold'])
        .prefix('BROWSER')
        .text('Styled text in browser')
        .print()
    }).not.toThrow()
  })

  it('should display dividers in browser', () => {
    expect(() => {
      logger.info
        .prependDivider('=', 20)
        .text('Browser divider test')
        .appendDivider('*', 15)
        .print()
    }).not.toThrow()
  })

  it('should handle data logging in browser', () => {
    const testData = {
      browser: 'Chrome',
      version: '120.0.0',
      features: ['ES6', 'WebGL', 'ServiceWorker'],
    }

    expect(() => {
      logger.info
        .prefix('BROWSER_DATA')
        .text('Browser information')
        .data(testData)
        .print()
    }).not.toThrow()
  })

  it('should handle time display in browser', () => {
    expect(() => {
      logger.info
        .time()
        .text('Browser timestamp test')
        .print()
    }).not.toThrow()
  })

  it('should handle emphasized text in browser', () => {
    expect(() => {
      logger.info
        .text('This has [[emphasized text]] in browser')
        .print()
    }).not.toThrow()
  })

  it('should convert to string in browser environment', () => {
    const logString = logger.info
      .prefix('BROWSER')
      .text('String conversion test')
      .toString()

    expect(typeof logString).toBe('string')
    expect(logString.length).toBeGreaterThan(0)
  })

  it('should handle StreamLogger gracefully in browser', () => {
    expect(() => {
      const streamLogger = new StreamLogger('Browser Stream', ['cyan'])
      streamLogger.text('Stream test in browser').update()
    }).not.toThrow()
  })
})

describe('cross-Platform Feature Detection', () => {
  it('should detect environment correctly', () => {
    // Test that the logger adapts to different environments
    expect(() => {
      logger.info.text('Environment detection test').print()
    }).not.toThrow()
  })

  it('should handle missing optional dependencies gracefully', () => {
    expect(() => {
      logger
        .error
        .prefix('NO_DEPS')
        .text('Testing without optional dependencies')
        .print()
    }).not.toThrow()
  })

  it('should maintain API consistency across environments', () => {
    const methods = [
      'text',
      'prefix',
      'detail',
      'data',
      'time',
      'styles',
      'prependDivider',
      'appendDivider',
      'print',
      'toString',
    ]

    const loggerInstance = logger.info

    methods.forEach((method) => {
      expect(typeof loggerInstance[method]).toBe('function')
    })
  })
})
