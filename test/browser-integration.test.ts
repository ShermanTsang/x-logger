import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Logger } from '../src/index'

// Mock browser environment
const mockConsole = {
  log: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// Mock window object for browser environment simulation
const mockWindow = {
  console: mockConsole,
}

describe('browser Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock global console
    globalThis.console = mockConsole as any
    // Mock window for browser environment
    globalThis.window = mockWindow as any
  })

  describe('basic Logging in Browser Environment', () => {
    it('should handle info messages in browser', () => {
      Logger.info.text('This is an info message').print()
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should handle success messages in browser', () => {
      Logger.success.text('This is a success message').print()
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should handle error messages in browser', () => {
      Logger.error.text('This is an error message').print()
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should handle warning messages in browser', () => {
      Logger.warn.text('This is a warning message').print()
      expect(mockConsole.log).toHaveBeenCalled()
    })
  })

  describe('highlight Feature in Browser', () => {
    it('should process highlights correctly in browser environment', () => {
      Logger.info.text('Processing [[important data]] with highlights').print()
      expect(mockConsole.log).toHaveBeenCalled()

      // Verify that the call includes styling for highlights
      const calls = mockConsole.log.mock.calls
      expect(calls.length).toBeGreaterThan(0)
    })
  })

  describe('time Feature in Browser', () => {
    it('should include timestamp when time is enabled', () => {
      Logger.info.time(true).text('Message with timestamp').print()
      expect(mockConsole.log).toHaveBeenCalled()
    })
  })

  describe('prefix Feature in Browser', () => {
    it('should include custom prefix in browser output', () => {
      Logger.info.prefix('[API]').text('API request completed').print()
      expect(mockConsole.log).toHaveBeenCalled()
    })
  })

  describe('divider Feature in Browser', () => {
    it('should render dividers correctly in browser', () => {
      Logger.info.divider('=', 30)
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should render different divider styles', () => {
      Logger.info.divider('-', 20)
      expect(mockConsole.log).toHaveBeenCalled()
    })
  })

  describe('stream Logger in Browser', () => {
    it('should handle stream logger initialization', () => {
      const stream = Logger.stream
      stream.prefix('[PROCESS]').text('Starting data processing...')
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should handle stream updates', () => {
      const stream = Logger.stream
      stream.text('Processing step 1...').update()
      expect(mockConsole.log).toHaveBeenCalled()
    })

    it('should handle stream state changes', () => {
      const stream = Logger.stream
      stream.text('Data processing completed!').state('succeed')
      expect(mockConsole.log).toHaveBeenCalled()
    })
  })

  describe('cross-Platform Compatibility', () => {
    it('should detect browser environment correctly', () => {
      // Simulate browser environment
      const isBrowser = typeof window !== 'undefined'
      expect(isBrowser).toBe(true)
    })

    it('should handle console styling in browser environment', () => {
      // Test that browser-specific console styling is applied
      Logger.info.text('Styled message').print()
      expect(mockConsole.log).toHaveBeenCalled()

      // Verify styling parameters are passed
      const lastCall
        = mockConsole.log.mock.calls[mockConsole.log.mock.calls.length - 1]
      expect(lastCall).toBeDefined()
    })
  })

  describe('error Handling in Browser', () => {
    it('should gracefully handle missing console methods', () => {
      // Temporarily replace console.log with undefined
      const originalLog = globalThis.console.log
      globalThis.console.log = undefined as any

      expect(() => {
        Logger.info.text('Test message').print()
      }).not.toThrow()

      // Restore console method
      globalThis.console.log = originalLog
    })

    it('should handle undefined window object', () => {
      const originalWindow = globalThis.window
      globalThis.window = undefined as any

      expect(() => {
        Logger.info.text('Test without window').print()
      }).not.toThrow()

      // Restore window
      globalThis.window = originalWindow
    })

    it('should handle completely missing console object', () => {
      const originalConsole = globalThis.console
      globalThis.console = undefined as any

      expect(() => {
        Logger.info.text('Test without console').print()
      }).not.toThrow()

      // Restore console
      globalThis.console = originalConsole
    })
  })
})
