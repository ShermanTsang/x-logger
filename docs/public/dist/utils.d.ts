/**
 * Consolidated utility functions for Sherman Logger
 * Combines functionality from utils, console-utils, text-processor, and adapter
 */
import type { Type } from './typings';
/**
 * Environment detection utilities for cross-platform compatibility
 */
/**
 * Detects if the current environment is a browser
 */
export declare const isBrowser: boolean;
/**
 * Detects if the current environment is Node.js
 */
export declare const isNode: any;
export declare function sleep(ms: number): Promise<unknown>;
/**
 * Safe console logging with error handling
 * Silently ignores any errors that might occur during logging
 */
export declare function safeConsoleLog(...args: any[]): void;
/**
 * Enhanced browser console styling for special patterns
 * Handles [[text]] pattern for browser highlighting
 */
export declare function processBrowserText(text: string): {
    text: string;
    styles?: string;
};
/**
 * Lazily loads and returns the chalk instance for Node.js environments
 */
export declare function getChalk(): Promise<any>;
/**
 * Gets the current chalk instance (may be null if not loaded)
 */
export declare function getChalkInstance(): any;
/**
 * Browser-compatible styling function
 */
export declare function getStyledText(styles: Type.Styles | undefined, text: string): {
    text: string;
    styles?: string;
};
/**
 * Browser-compatible console logging with styling
 */
export declare function logWithStyle(message: string, styles?: Type.Styles): void;
type StorageEstimate = Type.StorageEstimate;
/**
 * Safe navigator access for environments where navigator might be undefined
 * (e.g., some server-side rendering contexts)
 */
export declare const safeNavigator: {
    /**
     * Safely get user agent string
     * @returns User agent string or fallback value
     */
    getUserAgent(): string;
    /**
     * Safely check if storage API is available
     * @returns boolean indicating if storage.estimate is available
     */
    hasStorageAPI(): boolean;
    /**
     * Safely get storage estimate
     * @returns Storage estimate or null if not available
     */
    getStorageEstimate(): Promise<StorageEstimate | null>;
    /**
     * Safely check if navigator is available
     * @returns boolean indicating if navigator object exists
     */
    isAvailable(): boolean;
    /**
     * Safely access navigator properties to prevent userAgentData or other property access errors
     * @param property - The navigator property to access
     * @returns The property value or null if not available
     */
    safeNavigatorProperty<T = any>(property: string): T | null;
    /**
     * Get enhanced user agent string
     * @returns User agent string
     */
    getEnhancedUserAgent(): string;
    /**
     * Safely detect if running on mobile device
     * @returns boolean indicating if on mobile device
     */
    isMobile(): boolean;
    /**
     * Get environment information
     * @returns Environment information object
     */
    getEnvironmentInfo(): {
        isNavigatorAvailable: boolean;
        hasStorageAPI: boolean;
        isMobile: boolean;
        userAgent: string;
    };
};
export {};
