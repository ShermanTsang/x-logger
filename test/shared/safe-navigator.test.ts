import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { safeNavigator } from '../../src/utils'

describe('safeNavigator Utility Tests', () => {
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
      } as any

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
      const mockNavigator = {} as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.getUserAgent()).toBe('Unknown UserAgent')
    })

    it('should return fallback when navigator.userAgent is null', () => {
      const mockNavigator = {
        userAgent: null,
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.getUserAgent()).toBe('Unknown UserAgent')
    })

    it('should return fallback when navigator.userAgent is empty string', () => {
      const mockNavigator = {
        userAgent: '',
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.getUserAgent()).toBe('Unknown UserAgent')
    })

    it('should handle various browser user agents', () => {
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
      ]

      userAgents.forEach((userAgent) => {
        const mockNavigator = { userAgent } as any
        Object.defineProperty(globalThis, 'navigator', {
          value: mockNavigator,
          writable: true,
          configurable: true,
        })

        expect(safeNavigator.getUserAgent()).toBe(userAgent)
      })
    })
  })

  describe('isAvailable', () => {
    it('should return true when navigator is available', () => {
      const mockNavigator = {} as any

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

    it('should return true for partial navigator objects', () => {
      const partialNavigator = {
        userAgent: 'Test Browser',
        // Missing other properties
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: partialNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.isAvailable()).toBe(true)
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

    it('should return false when storage API is not available', () => {
      const mockNavigator = {} as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.hasStorageAPI()).toBe(false)
    })

    it('should return false when navigator is not available', () => {
      delete (globalThis as any).navigator

      expect(safeNavigator.hasStorageAPI()).toBe(false)
    })

    it('should return false when storage is null', () => {
      const mockNavigator = {
        storage: null,
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.hasStorageAPI()).toBe(false)
    })

    it('should return false when storage is undefined', () => {
      const mockNavigator = {
        storage: undefined,
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.hasStorageAPI()).toBe(false)
    })
  })

  describe('safeNavigatorProperty', () => {
    it('should safely access existing navigator properties', () => {
      const mockNavigator = {
        userAgent: 'Test Browser',
        language: 'en-US',
        platform: 'Win32',
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.safeNavigatorProperty('userAgent')).toBe('Test Browser')
      expect(safeNavigator.safeNavigatorProperty('language')).toBe('en-US')
      expect(safeNavigator.safeNavigatorProperty('platform')).toBe('Win32')
    })

    it('should return null for non-existent properties', () => {
      const mockNavigator = {
        userAgent: 'Test Browser',
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.safeNavigatorProperty('nonExistentProperty')).toBeNull()
    })

    it('should return null when navigator is not available', () => {
      delete (globalThis as any).navigator

      expect(safeNavigator.safeNavigatorProperty('userAgent')).toBeNull()
    })

    it('should handle property access errors gracefully', () => {
      const mockNavigator = {}
      Object.defineProperty(mockNavigator, 'userAgent', {
        get() {
          throw new Error('Property access denied')
        },
      })

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.safeNavigatorProperty('userAgent')).toBeNull()
    })
  })

  describe('isMobile', () => {
    it('should detect mobile user agents correctly', () => {
      const mobileUserAgents = [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
        'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X)',
        'Mozilla/5.0 (Linux; Android 11; SM-G991B)',
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5)',
        'Opera/9.80 (J2ME/MIDP; Opera Mini/9.80)',
      ]

      mobileUserAgents.forEach((userAgent) => {
        const mockNavigator = { userAgent } as any
        Object.defineProperty(globalThis, 'navigator', {
          value: mockNavigator,
          writable: true,
          configurable: true,
        })

        expect(safeNavigator.isMobile()).toBe(true)
      })
    })

    it('should not detect desktop user agents as mobile', () => {
      const desktopUserAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      ]

      desktopUserAgents.forEach((userAgent) => {
        const mockNavigator = { userAgent } as any
        Object.defineProperty(globalThis, 'navigator', {
          value: mockNavigator,
          writable: true,
          configurable: true,
        })

        expect(safeNavigator.isMobile()).toBe(false)
      })
    })

    it('should return false when navigator is unavailable', () => {
      delete (globalThis as any).navigator

      expect(safeNavigator.isMobile()).toBe(false)
    })

    it('should return false when userAgent is Unknown', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: null,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.isMobile()).toBe(false)
    })
  })

  describe('getStorageEstimate', () => {
    it('should return storage estimate when available', async () => {
      const mockEstimate = {
        quota: 1000000000,
        usage: 500000000,
      }

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
      const mockNavigator = {} as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      const result = await safeNavigator.getStorageEstimate()
      expect(result).toBeNull()
    })

    it('should return null when navigator is not available', async () => {
      delete (globalThis as any).navigator

      const result = await safeNavigator.getStorageEstimate()
      expect(result).toBeNull()
    })

    it('should handle storage estimate errors gracefully', async () => {
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
  })

  describe('getEnvironmentInfo', () => {
    it('should return complete environment information', () => {
      const mockNavigator = {
        userAgent: 'Mozilla/5.0 (Test Browser)',
        storage: {
          estimate: vi.fn(),
        },
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      const envInfo = safeNavigator.getEnvironmentInfo()

      expect(envInfo).toEqual({
        isNavigatorAvailable: true,
        hasStorageAPI: true,
        isMobile: false,
        userAgent: 'Mozilla/5.0 (Test Browser)',
      })
    })

    it('should handle unavailable navigator gracefully', () => {
      delete (globalThis as any).navigator

      const envInfo = safeNavigator.getEnvironmentInfo()

      expect(envInfo).toEqual({
        isNavigatorAvailable: false,
        hasStorageAPI: false,
        isMobile: false,
        userAgent: 'Unknown UserAgent',
      })
    })

    it('should detect mobile environment correctly', () => {
      const mockNavigator = {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      const envInfo = safeNavigator.getEnvironmentInfo()

      expect(envInfo.isMobile).toBe(true)
      expect(envInfo.userAgent).toContain('iPhone')
    })
  })

  describe('getEnhancedUserAgent', () => {
    it('should return enhanced user agent string', () => {
      const mockNavigator = {
        userAgent: 'Mozilla/5.0 (Enhanced Browser)',
      } as any

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.getEnhancedUserAgent()).toBe('Mozilla/5.0 (Enhanced Browser)')
    })

    it('should return fallback when navigator is unavailable', () => {
      delete (globalThis as any).navigator

      expect(safeNavigator.getEnhancedUserAgent()).toBe('Unknown UserAgent')
    })
  })

  describe('edge Cases and Error Handling', () => {
    it('should handle navigator with getter that throws', () => {
      Object.defineProperty(globalThis, 'navigator', {
        get() {
          throw new Error('Navigator access denied')
        },
        configurable: true,
      })

      expect(() => safeNavigator.isAvailable()).not.toThrow()
      expect(() => safeNavigator.getUserAgent()).not.toThrow()
      expect(() => safeNavigator.isMobile()).not.toThrow()
      expect(() => safeNavigator.hasStorageAPI()).not.toThrow()
    })

    it('should handle properties with getters that throw', () => {
      const mockNavigator = {} as any
      Object.defineProperty(mockNavigator, 'userAgent', {
        get() {
          throw new Error('UserAgent access denied')
        },
      })

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(() => safeNavigator.getUserAgent()).not.toThrow()
      expect(safeNavigator.getUserAgent()).toBe('Unknown UserAgent')
    })

    it('should handle frozen navigator object', () => {
      const mockNavigator = Object.freeze({
        userAgent: 'Frozen Browser',
        language: 'en-US',
        platform: 'FrozenOS',
      })

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.getUserAgent()).toBe('Frozen Browser')
      expect(safeNavigator.safeNavigatorProperty('language')).toBe('en-US')
      expect(safeNavigator.safeNavigatorProperty('platform')).toBe('FrozenOS')
    })

    it('should handle navigator with circular references', () => {
      const mockNavigator: any = {
        userAgent: 'Circular Browser',
      }
      mockNavigator.self = mockNavigator // Create circular reference

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(() => safeNavigator.getUserAgent()).not.toThrow()
      expect(safeNavigator.getUserAgent()).toBe('Circular Browser')
    })
  })
})
