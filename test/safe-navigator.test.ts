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

    it('should handle environments with no storage API', async () => {
      // Simulate environment where navigator exists but storage doesn't
      const mockNavigator = {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
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

  describe('isMobile', () => {
    it('should detect mobile user agents', () => {
      const mobileUserAgents = [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        'Mozilla/5.0 (Linux; Android 10)',
        'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900)',
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5)',
        'Opera/9.80 (J2ME/MIDP; Opera Mini/9.80)',
      ]

      mobileUserAgents.forEach((userAgent) => {
        const mockNavigator = { userAgent } as Navigator
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
        const mockNavigator = { userAgent } as Navigator
        Object.defineProperty(globalThis, 'navigator', {
          value: mockNavigator,
          writable: true,
          configurable: true,
        })

        expect(safeNavigator.isMobile()).toBe(false)
      })
    })

    it('should return false when navigator is unavailable', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: undefined,
        writable: true,
        configurable: true,
      })

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

  describe('safeNavigatorProperty', () => {
    it('should safely access existing navigator properties', () => {
      const mockNavigator = {
        userAgent: 'Test Browser',
        language: 'en-US',
      } as Navigator

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.safeNavigatorProperty('userAgent')).toBe('Test Browser')
      expect(safeNavigator.safeNavigatorProperty('language')).toBe('en-US')
    })

    it('should return null for non-existent properties', () => {
      const mockNavigator = {
        userAgent: 'Test Browser',
      } as Navigator

      Object.defineProperty(globalThis, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true,
      })

      expect(safeNavigator.safeNavigatorProperty('nonExistentProperty')).toBeNull()
    })

    it('should return null when navigator is unavailable', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: undefined,
        writable: true,
        configurable: true,
      })

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
      // Mock navigator that throws when accessed
      Object.defineProperty(globalThis, 'navigator', {
        get() {
          throw new Error('Navigator access denied')
        },
        configurable: true,
      })

      expect(safeNavigator.isAvailable()).toBe(false)
    })
  })
})
