import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isBrowser, isWeChatMiniapp } from "../src/adapter";
import { safeNavigator } from "../src/utils";

describe("weChat Miniapp Support", () => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  let originalGlobalThis: any;
  let originalWx: any;

  beforeEach(() => {
    originalGlobalThis = globalThis;
    originalWx = (globalThis as any).wx;
  });

  afterEach(() => {
    // Restore original state
    if (originalWx !== undefined) {
      (globalThis as any).wx = originalWx;
    } else {
      delete (globalThis as any).wx;
    }
  });

  describe("isWeChatMiniapp detection", () => {
    it("should detect WeChat miniapp environment when wx.getSystemInfoSync is available", () => {
      const mockWx = {
        getSystemInfoSync: vi.fn().mockReturnValue({
          brand: "iPhone",
          model: "iPhone 12",
          system: "iOS 14.0",
          platform: "ios",
          version: "8.0.0",
          SDKVersion: "2.19.0",
        }),
      };

      Object.defineProperty(globalThis, "wx", {
        value: mockWx,
        writable: true,
        configurable: true,
      });

      expect(safeNavigator.isWeChatMiniapp()).toBe(true);
    });

    it("should not detect WeChat miniapp when wx is undefined", () => {
      delete (globalThis as any).wx;

      expect(safeNavigator.isWeChatMiniapp()).toBe(false);
    });

    it("should not detect WeChat miniapp when wx.getSystemInfoSync is not a function", () => {
      const mockWx = {
        getSystemInfoSync: "not a function",
      };

      Object.defineProperty(globalThis, "wx", {
        value: mockWx,
        writable: true,
        configurable: true,
      });

      expect(safeNavigator.isWeChatMiniapp()).toBe(false);
    });

    it("should handle exceptions gracefully", () => {
      Object.defineProperty(globalThis, "wx", {
        get() {
          throw new Error("Access denied");
        },
        configurable: true,
      });

      expect(safeNavigator.isWeChatMiniapp()).toBe(false);
    });
  });

  describe("getWeChatSystemInfo", () => {
    it("should return system info when in WeChat miniapp", () => {
      const mockSystemInfo = {
        brand: "iPhone",
        model: "iPhone 12",
        pixelRatio: 3,
        screenWidth: 414,
        screenHeight: 896,
        windowWidth: 414,
        windowHeight: 896,
        statusBarHeight: 44,
        language: "zh_CN",
        version: "8.0.0",
        system: "iOS 14.0",
        platform: "ios",
        fontSizeSetting: 16,
        SDKVersion: "2.19.0",
        benchmarkLevel: 1,
        albumAuthorized: true,
        cameraAuthorized: true,
        locationAuthorized: true,
        microphoneAuthorized: true,
        notificationAuthorized: true,
        notificationAlertAuthorized: true,
        notificationBadgeAuthorized: true,
        notificationSoundAuthorized: true,
        bluetoothEnabled: true,
        locationEnabled: true,
        wifiEnabled: true,
        safeArea: {
          left: 0,
          right: 414,
          top: 44,
          bottom: 896,
          width: 414,
          height: 852,
        },
      };

      const mockWx = {
        getSystemInfoSync: vi.fn().mockReturnValue(mockSystemInfo),
      };

      Object.defineProperty(globalThis, "wx", {
        value: mockWx,
        writable: true,
        configurable: true,
      });

      const result = safeNavigator.getWeChatSystemInfo();
      expect(result).toEqual(mockSystemInfo);
      expect(mockWx.getSystemInfoSync).toHaveBeenCalled();
    });

    it("should return null when not in WeChat miniapp", () => {
      delete (globalThis as any).wx;

      const result = safeNavigator.getWeChatSystemInfo();
      expect(result).toBeNull();
    });

    it("should return null when getSystemInfoSync throws an error", () => {
      const mockWx = {
        getSystemInfoSync: vi.fn().mockImplementation(() => {
          throw new Error("System info error");
        }),
      };

      Object.defineProperty(globalThis, "wx", {
        value: mockWx,
        writable: true,
        configurable: true,
      });

      const result = safeNavigator.getWeChatSystemInfo();
      expect(result).toBeNull();
    });
  });

  describe("getEnhancedUserAgent", () => {
    it("should return WeChat miniapp user agent when in miniapp", () => {
      const mockSystemInfo = {
        brand: "iPhone",
        model: "iPhone 12",
        system: "iOS 14.0",
        version: "8.0.0",
        SDKVersion: "2.19.0",
      };

      const mockWx = {
        getSystemInfoSync: vi.fn().mockReturnValue(mockSystemInfo),
      };

      Object.defineProperty(globalThis, "wx", {
        value: mockWx,
        writable: true,
        configurable: true,
      });

      const result = safeNavigator.getEnhancedUserAgent();
      expect(result).toBe(
        "WeChat-Miniapp/8.0.0 (iOS 14.0; iPhone 12) MicroMessenger/2.19.0"
      );
    });

    it("should return fallback WeChat miniapp user agent when system info is unavailable", () => {
      const mockWx = {
        getSystemInfoSync: vi.fn().mockImplementation(() => {
          throw new Error("System info error");
        }),
      };

      Object.defineProperty(globalThis, "wx", {
        value: mockWx,
        writable: true,
        configurable: true,
      });

      const result = safeNavigator.getEnhancedUserAgent();
      expect(result).toBe("WeChat-Miniapp/Unknown");
    });

    it("should return regular user agent when not in WeChat miniapp", () => {
      delete (globalThis as any).wx;

      // Mock navigator
      const mockNavigator = {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      } as Navigator;

      Object.defineProperty(globalThis, "navigator", {
        value: mockNavigator,
        writable: true,
        configurable: true,
      });

      const result = safeNavigator.getEnhancedUserAgent();
      expect(result).toBe(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      );
    });
  });

  describe("getEnvironmentInfo", () => {
    it("should return complete environment info for WeChat miniapp", () => {
      const mockSystemInfo = {
        brand: "iPhone",
        model: "iPhone 12",
        system: "iOS 14.0",
        version: "8.0.0",
        SDKVersion: "2.19.0",
      };

      const mockWx = {
        getSystemInfoSync: vi.fn().mockReturnValue(mockSystemInfo),
      };

      // Remove navigator to simulate WeChat miniapp environment
      const originalNavigator = globalThis.navigator;
      delete (globalThis as any).navigator;

      Object.defineProperty(globalThis, "wx", {
        value: mockWx,
        writable: true,
        configurable: true,
      });

      const result = safeNavigator.getEnvironmentInfo();

      expect(result.isWeChatMiniapp).toBe(true);
      expect(result.isNavigatorAvailable).toBe(false); // No navigator in miniapp
      expect(result.hasStorageAPI).toBe(false); // No storage API in miniapp
      expect(result.userAgent).toBe(
        "WeChat-Miniapp/8.0.0 (iOS 14.0; iPhone 12) MicroMessenger/2.19.0"
      );
      expect(result.weChatSystemInfo).toEqual(mockSystemInfo);

      // Restore navigator
      if (originalNavigator) {
        Object.defineProperty(globalThis, "navigator", {
          value: originalNavigator,
          writable: true,
          configurable: true,
        });
      }
    });

    it("should return environment info without WeChat data for regular browser", () => {
      delete (globalThis as any).wx;

      // Mock navigator
      const mockNavigator = {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      } as Navigator;

      Object.defineProperty(globalThis, "navigator", {
        value: mockNavigator,
        writable: true,
        configurable: true,
      });

      const result = safeNavigator.getEnvironmentInfo();

      expect(result.isWeChatMiniapp).toBe(false);
      expect(result.isNavigatorAvailable).toBe(true);
      expect(result.hasStorageAPI).toBe(false); // No storage in mock
      expect(result.userAgent).toBe(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      );
      expect(result.weChatSystemInfo).toBeUndefined();
    });
  });

  describe("adapter environment detection", () => {
    it("should have correct environment detection logic", () => {
      // Since environment detection happens at module load time,
      // we test the current environment state

      // In test environment, wx is not available by default
      expect(isWeChatMiniapp).toBe(false);

      // Check what the test environment actually provides
      const hasWindow =
        typeof globalThis !== "undefined" &&
        typeof (globalThis as any).window !== "undefined";
      const hasDocument =
        typeof globalThis !== "undefined" &&
        typeof (globalThis as any).document !== "undefined";
      const hasProcess =
        typeof globalThis !== "undefined" &&
        typeof (globalThis as any).process !== "undefined";

      // Log for debugging
      console.log("Test environment:", {
        hasWindow,
        hasDocument,
        hasProcess,
        isBrowser,
        isNode: typeof process !== "undefined",
      });

      // Test that the logic would work correctly
      // (We can't change module-level constants during runtime)
      const hasWx =
        typeof globalThis !== "undefined" &&
        typeof (globalThis as any).wx !== "undefined" &&
        typeof (globalThis as any).wx.getSystemInfoSync === "function";

      // The test environment might be Node.js, not browser
      expect(typeof isWeChatMiniapp).toBe("boolean");
      expect(typeof isBrowser).toBe("boolean");
      expect(hasWx).toBe(false); // No wx in test environment
    });
  });

  describe("error handling", () => {
    it("should handle all WeChat miniapp methods gracefully when wx throws errors", () => {
      // Remove navigator to simulate environment where both wx and navigator are unavailable
      const originalNavigator = globalThis.navigator;
      delete (globalThis as any).navigator;

      Object.defineProperty(globalThis, "wx", {
        get() {
          throw new Error("WeChat API error");
        },
        configurable: true,
      });

      expect(safeNavigator.isWeChatMiniapp()).toBe(false);
      expect(safeNavigator.getWeChatSystemInfo()).toBeNull();
      expect(safeNavigator.getEnhancedUserAgent()).toBe("Unknown UserAgent");

      const envInfo = safeNavigator.getEnvironmentInfo();
      expect(envInfo.isWeChatMiniapp).toBe(false);
      expect(envInfo.weChatSystemInfo).toBeUndefined();

      // Restore navigator
      if (originalNavigator) {
        Object.defineProperty(globalThis, "navigator", {
          value: originalNavigator,
          writable: true,
          configurable: true,
        });
      }
    });

    it("should handle wx errors but still use navigator when available", () => {
      // Mock navigator
      const mockNavigator = {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      } as Navigator;

      Object.defineProperty(globalThis, "navigator", {
        value: mockNavigator,
        writable: true,
        configurable: true,
      });

      Object.defineProperty(globalThis, "wx", {
        get() {
          throw new Error("WeChat API error");
        },
        configurable: true,
      });

      expect(safeNavigator.isWeChatMiniapp()).toBe(false);
      expect(safeNavigator.getWeChatSystemInfo()).toBeNull();
      expect(safeNavigator.getEnhancedUserAgent()).toBe(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      );

      const envInfo = safeNavigator.getEnvironmentInfo();
      expect(envInfo.isWeChatMiniapp).toBe(false);
      expect(envInfo.weChatSystemInfo).toBeUndefined();
    });

    it("should handle partial WeChat API availability", () => {
      const mockWx = {
        // Missing getSystemInfoSync
        someOtherMethod: vi.fn(),
      };

      Object.defineProperty(globalThis, "wx", {
        value: mockWx,
        writable: true,
        configurable: true,
      });

      expect(safeNavigator.isWeChatMiniapp()).toBe(false);
      expect(safeNavigator.getWeChatSystemInfo()).toBeNull();
    });
  });
});
