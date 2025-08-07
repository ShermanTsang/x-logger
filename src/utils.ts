export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Type definitions for storage API
interface StorageEstimate {
  quota?: number
  usage?: number
}

interface NavigatorStorage {
  estimate: () => Promise<StorageEstimate>
}

/**
 * Safe navigator access for environments where navigator might be undefined
 * (e.g., some server-side rendering contexts)
 */
export const safeNavigator = {
  /**
   * Safely get user agent string
   * @returns User agent string or fallback value
   */
  getUserAgent(): string {
    try {
      const userAgent = safeNavigator.safeNavigatorProperty<string>('userAgent')
      return userAgent && typeof userAgent === 'string' ? userAgent : 'Unknown UserAgent'
    }
    catch {
      return 'Unknown UserAgent'
    }
  },

  /**
   * Safely check if storage API is available
   * @returns boolean indicating if storage.estimate is available
   */
  hasStorageAPI(): boolean {
    try {
      const storage = safeNavigator.safeNavigatorProperty<NavigatorStorage>('storage')
      return storage !== null
        && typeof storage === 'object'
        && typeof storage.estimate === 'function'
    }
    catch {
      return false
    }
  },

  /**
   * Safely get storage estimate
   * @returns Storage estimate or null if not available
   */
  async getStorageEstimate(): Promise<StorageEstimate | null> {
    try {
      if (safeNavigator.hasStorageAPI()) {
        const storage = safeNavigator.safeNavigatorProperty<NavigatorStorage>('storage')
        if (storage && typeof storage.estimate === 'function') {
          return await storage.estimate()
        }
      }
      return null
    }
    catch {
      return null
    }
  },

  /**
   * Safely check if navigator is available
   * @returns boolean indicating if navigator object exists
   */
  isAvailable(): boolean {
    try {
      return typeof navigator !== 'undefined' && navigator !== null
    }
    catch {
      return false
    }
  },

  /**
   * Safely access navigator properties to prevent userAgentData or other property access errors
   * @param property - The navigator property to access
   * @returns The property value or null if not available
   */
  safeNavigatorProperty<T = any>(property: string): T | null {
    try {
      if (!safeNavigator.isAvailable()) {
        return null
      }

      // Use Object.prototype.hasOwnProperty for safe property checking
      if (Object.prototype.hasOwnProperty.call(navigator, property)) {
        return (navigator as any)[property]
      }

      return null
    }
    catch {
      return null
    }
  },

  /**
   * Get enhanced user agent string
   * @returns User agent string
   */
  getEnhancedUserAgent(): string {
    try {
      return safeNavigator.getUserAgent()
    }
    catch {
      return safeNavigator.getUserAgent()
    }
  },

  /**
   * Safely detect if running on mobile device
   * @returns boolean indicating if on mobile device
   */
  isMobile(): boolean {
    try {
      const userAgent = safeNavigator.getUserAgent()
      if (userAgent === 'Unknown UserAgent') {
        return false
      }
      return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(userAgent)
    }
    catch {
      return false
    }
  },

  /**
   * Get environment information
   * @returns Environment information object
   */
  getEnvironmentInfo(): {
    isNavigatorAvailable: boolean
    hasStorageAPI: boolean
    isMobile: boolean
    userAgent: string
  } {
    return {
      isNavigatorAvailable: safeNavigator.isAvailable(),
      hasStorageAPI: safeNavigator.hasStorageAPI(),
      isMobile: safeNavigator.isMobile(),
      userAgent: safeNavigator.getEnhancedUserAgent(),
    }
  },
}
