import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { safeNavigator } from '../src/utils'

describe('safeNavigator', () => {
  let originalNavigator: Navigator | undefined

  beforeEach(() => {
    originalNavigator = globalThis.navigator
  })

  afterEach(() => {
    // Restore original navigator
    if (originalNavigator) {
      Object.defineProperty(globalThis, 'navigator', {
        value: originalNavigator,
        writable: true,
        configurable: true,
      })
    }
    else {
      delete (globalThis as any).navigator
    }
  })

  describe('getUserAgent', () => {
    it('should return user agent when navigator is available', () => {
      const mockNavigator = {
        userAgent: 'Mozilla/5.0 (Test Browser)',
      } as Navigator

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.getUserAgent()).toBe('Mozilla/5.0 (Test Browser)')
    })

    it('should return fallback when navigator is undefined', () => {
      delete (globalThis as any).navigator

      expect(safeNavigator.getUserAgent()).toBe('Unknown UserAgent')
    })

    it('should return fallback when navigator.userAgent is undefined', () => {
      const mockNavigator = {} as Navigator

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.getUserAgent()).toBe('Unknown UserAgent')
    })

    it('should handle WeChat miniapp user agent', () => {
      const mockNavigator = {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.0(0x18000029) NetType/WIFI Language/zh_CN miniProgram',
      } as Navigator

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      const userAgent = safeNavigator.getUserAgent()
      expect(userAgent).toContain('miniProgram')
      expect(userAgent).toContain('MicroMessenger')
    })
  })

  describe('isAvailable', () => {
    it('should return true when navigator is available', () => {
      const mockNavigator = {} as Navigator

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.isAvailable()).toBe(true)
    })

    it('should return false when navigator is undefined', () => {
      delete (globalThis as any).navigator

      expect(safeNavigator.isAvailable()).toBe(false)
    })

    it('should return false when navigator is null', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: null,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.isAvailable()).toBe(false)
    })
  })

  describe('hasStorageAPI', () => {
    it('should return true when storage API is available', () => {
      const mockNavigator = {
        storage: {
          estimate: vi.fn(),
        },
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.hasStorageAPI()).toBe(true)
    })

    it('should return false when navigator is undefined', () => {
      delete (globalThis as any).navigator

      expect(safeNavigator.hasStorageAPI()).toBe(false)
    })

    it('should return false when storage is not available', () => {
      const mockNavigator = {} as Navigator

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.hasStorageAPI()).toBe(false)
    })

    it('should return false when storage.estimate is not a function', () => {
      const mockNavigator = {
        storage: {
          estimate: 'not a function',
        },
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.hasStorageAPI()).toBe(false)
    })
  })

  describe('getStorageEstimate', () => {
    it('should return storage estimate when API is available', async () => {
      const mockEstimate = { quota: 1000000, usage: 500000 }
      const mockNavigator = {
        storage: {
          estimate: vi.fn().mockResolvedValue(mockEstimate),
        },
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      const result = await safeNavigator.getStorageEstimate()
      expect(result).toEqual(mockEstimate)
      expect(mockNavigator.storage.estimate).toHaveBeenCalled()
    })

    it('should return null when storage API is not available', async () => {
      delete (globalThis as any).navigator

      const result = await safeNavigator.getStorageEstimate()
      expect(result).toBeNull()
    })

    it('should return null when storage.estimate throws an error', async () => {
      const mockNavigator = {
        storage: {
          estimate: vi.fn().mockRejectedValue(new Error('Storage error')),
        },
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      const result = await safeNavigator.getStorageEstimate()
      expect(result).toBeNull()
    })

    it('should handle WeChat miniapp environment (no storage API)', async () => {
      // Simulate WeChat miniapp environment where navigator exists but storage doesn't
      const mockNavigator = {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.0(0x18000029) NetType/WIFI Language/zh_CN miniProgram',
      } as Navigator

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.hasStorageAPI()).toBe(false)
      const result = await safeNavigator.getStorageEstimate()
      expect(result).toBeNull()
    })
  })

  describe('error handling', () => {
    it('should handle exceptions gracefully in getUserAgent', () => {
      // Mock navigator that throws when accessing userAgent
      const mockNavigator = {}
      Object.defineProperty(mockNavigator, 'userAgent', {
        get() {
          throw new Error('Access denied')
        },
      })

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.getUserAgent()).toBe('Unknown UserAgent')
    })

    it('should handle exceptions gracefully in isAvailable', () => {
      // Mock a scenario where accessing navigator throws
      Object.defineProperty(globalThis, 'navigator', {
        get() {
          throw new Error('Navigator access error')
        },
        configurable: true,
      })

      expect(safeNavigator.isAvailable()).toBe(false)
    })
  })
})
