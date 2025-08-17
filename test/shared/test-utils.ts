import { vi } from 'vitest'
import type { Type } from '../../src/typings'

/**
 * Mock console for testing output capture
 */
export function createMockConsole() {
  return {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }
}

/**
 * Mock browser environment
 */
export function mockBrowserEnvironment() {
  const mockConsole = createMockConsole()
  const mockWindow = { console: mockConsole }
  const mockDocument = { createElement: vi.fn() }

  const originalConsole = globalThis.console
  const originalWindow = globalThis.window
  const originalDocument = globalThis.document

  // Set up browser environment
  globalThis.console = mockConsole as any
  globalThis.window = mockWindow as any
  globalThis.document = mockDocument as any

  return {
    mockConsole,
    mockWindow,
    mockDocument,
    restore: () => {
      globalThis.console = originalConsole
      globalThis.window = originalWindow
      globalThis.document = originalDocument
    },
  }
}

/**
 * Mock Node.js environment
 */
export function mockNodeEnvironment() {
  const originalWindow = globalThis.window
  const originalDocument = globalThis.document

  // Remove browser globals
  delete (globalThis as any).window
  delete (globalThis as any).document

  return {
    restore: () => {
      globalThis.window = originalWindow
      globalThis.document = originalDocument
    },
  }
}

/**
 * Test data generators
 */
export const testData = {
  longText: 'A'.repeat(1000),
  unicodeText: '🚀 Special chars: ñáéíóú 中文 العربية русский 🎉',
  emptyString: '',
  nullValue: null,
  undefinedValue: undefined,
  complexObject: {
    nested: {
      array: [1, 2, 3],
      string: 'test',
      boolean: true,
    },
  },
}

/**
 * Common test styles for validation
 */
export const testStyles: Record<string, Type.Styles> = {
  basic: ['red', 'bold'],
  background: ['bgGreen', 'white'],
  complex: ['bgRedBright', 'bold', 'underline'],
  invalid: ['nonExistentStyle'] as Type.Styles,
}

/**
 * Performance test helpers
 */
export function measurePerformance<T>(fn: () => T): { result: T; duration: number } {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  return { result, duration: end - start }
}

/**
 * Async test helpers
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * String validation helpers
 */
export function validateLoggerOutput(output: string) {
  return {
    hasContent: () => output.length > 0,
    containsText: (text: string) => output.includes(text),
    hasTimestamp: () => /\d{1,2}:\d{2}:\d{2}/.test(output),
    hasDivider: () => /[-=*]{2,}/.test(output),
    isFormatted: () => output !== output.trim() || output.includes('\n'),
  }
}

/**
 * Mock stream logger for testing
 */
export function createMockStreamLogger() {
  const updates: string[] = []
  const states: string[] = []

  return {
    updates,
    states,
    mockUpdate: vi.fn((output: string) => {
      updates.push(output)
    }),
    mockState: vi.fn((state: string) => {
      states.push(state)
    }),
    getLastUpdate: () => updates[updates.length - 1],
    getLastState: () => states[states.length - 1],
    clear: () => {
      updates.length = 0
      states.length = 0
    },
  }
}

/**
 * Environment detection helpers
 */
export function isBrowserEnvironment(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function isNodeEnvironment(): boolean {
  return typeof process !== 'undefined' && process.versions?.node !== undefined
}

/**
 * Test case generators for common scenarios
 */
export function generateBasicLoggerTests() {
  return [
    { name: 'empty text', text: '' },
    { name: 'simple text', text: 'Hello World' },
    { name: 'long text', text: testData.longText },
    { name: 'unicode text', text: testData.unicodeText },
  ]
}

export function generateStyleTests() {
  return [
    { name: 'no styles', styles: [] },
    { name: 'single style', styles: ['red'] },
    { name: 'multiple styles', styles: ['red', 'bold'] },
    { name: 'background styles', styles: ['bgGreen', 'white'] },
  ]
}

/**
 * Error simulation helpers
 */
export function simulateError(message: string = 'Test error'): Error {
  return new Error(message)
}

export function simulateAsyncError(message: string = 'Async test error', delay: number = 10): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay)
  })
}