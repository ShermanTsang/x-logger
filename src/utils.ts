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

interface ExtendedNavigator extends Navigator {
  storage?: NavigatorStorage
}

// WeChat miniapp types
interface WeChatSystemInfo {
  brand: string
  model: string
  pixelRatio: number
  screenWidth: number
  screenHeight: number
  windowWidth: number
  windowHeight: number
  statusBarHeight: number
  language: string
  version: string
  system: string
  platform: string
  fontSizeSetting: number
  SDKVersion: string
  benchmarkLevel: number
  albumAuthorized: boolean
  cameraAuthorized: boolean
  locationAuthorized: boolean
  microphoneAuthorized: boolean
  notificationAuthorized: boolean
  notificationAlertAuthorized: boolean
  notificationBadgeAuthorized: boolean
  notificationSoundAuthorized: boolean
  bluetoothEnabled: boolean
  locationEnabled: boolean
  wifiEnabled: boolean
  safeArea: {
    left: number
    right: number
    top: number
    bottom: number
    width: number
    height: number
  }
}

interface WeChatAPI {
  getSystemInfoSync: () => WeChatSystemInfo
  getSystemInfo: (options: {
    success?: (res: WeChatSystemInfo) => void
    fail?: (err: any) => void
    complete?: () => void
  }) => void
}

/**
 * Safe navigator access for environments where navigator might be undefined
 * (e.g., WeChat miniapp, some server-side rendering contexts)
 */
export const safeNavigator = {
  /**
   * Safely get user agent string
   * @returns User agent string or fallback value
   */
  getUserAgent(): string {
    try {
      return typeof navigator !== 'undefined' && navigator?.userAgent
        ? navigator.userAgent
        : 'Unknown UserAgent'
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
      if (typeof navigator === 'undefined' || !navigator) {
        return false
      }

      const extendedNavigator = navigator as ExtendedNavigator
      return 'storage' in extendedNavigator
        && extendedNavigator.storage !== undefined
        && typeof extendedNavigator.storage.estimate === 'function'
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
      if (this.hasStorageAPI()) {
        const extendedNavigator = navigator as ExtendedNavigator
        return await extendedNavigator.storage!.estimate()
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
   * Check if running in WeChat miniapp environment
   * @returns boolean indicating if in WeChat miniapp
   */
  isWeChatMiniapp(): boolean {
    try {
      return typeof globalThis !== 'undefined'
        && typeof (globalThis as any).wx !== 'undefined'
        && typeof (globalThis as any).wx.getSystemInfoSync === 'function'
    }
    catch {
      return false
    }
  },

  /**
   * Get WeChat miniapp system information
   * @returns WeChat system info or null if not available
   */
  getWeChatSystemInfo(): WeChatSystemInfo | null {
    try {
      if (this.isWeChatMiniapp()) {
        const wx = (globalThis as any).wx as WeChatAPI
        return wx.getSystemInfoSync()
      }
      return null
    }
    catch {
      return null
    }
  },

  /**
   * Get user agent string with WeChat miniapp support
   * @returns Enhanced user agent string including WeChat miniapp info
   */
  getEnhancedUserAgent(): string {
    try {
      if (this.isWeChatMiniapp()) {
        const systemInfo = this.getWeChatSystemInfo()
        if (systemInfo) {
          return `WeChat-Miniapp/${systemInfo.version} (${systemInfo.system}; ${systemInfo.model}) MicroMessenger/${systemInfo.SDKVersion}`
        }
        return 'WeChat-Miniapp/Unknown'
      }

      return this.getUserAgent()
    }
    catch {
      return this.getUserAgent()
    }
  },

  /**
   * Get environment information including WeChat miniapp details
   * @returns Environment information object
   */
  getEnvironmentInfo(): {
    isWeChatMiniapp: boolean
    isNavigatorAvailable: boolean
    hasStorageAPI: boolean
    userAgent: string
    weChatSystemInfo?: WeChatSystemInfo | null
  } {
    const isWeChatMiniapp = this.isWeChatMiniapp()
    return {
      isWeChatMiniapp,
      isNavigatorAvailable: this.isAvailable(),
      hasStorageAPI: this.hasStorageAPI(),
      userAgent: this.getEnhancedUserAgent(),
      ...(isWeChatMiniapp && { weChatSystemInfo: this.getWeChatSystemInfo() }),
    }
  },
}
