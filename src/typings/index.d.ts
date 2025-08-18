import type { ChalkInstance } from 'chalk'
import type { Ora } from 'ora'

// Import global type declarations
import './global'

// Forward declarations for circular dependency resolution

// Callable logger type that represents logger instances that can be invoked as functions
export type CallableLogger = BaseLogger & ((...args: any[]) => BaseLogger)

export interface BaseLogger {
  // Core methods
  text: (...args: any[]) => this
  detail: (detail: string, styles?: Type.Styles) => this
  prefix: (prefix: string, styles?: Type.Styles) => this
  data: (...dataItems: any[]) => this
  time: (isDisplay?: boolean) => this
  valid: (isValid?: boolean) => this
  styles: (styles: Type.Styles) => this

  // Divider methods
  divider: (char?: string, length?: number, styles?: Type.Styles) => void
  prependDivider: (char?: string, length?: number, styles?: Type.Styles) => this
  appendDivider: (char?: string, length?: number, styles?: Type.Styles) => this

  // Output methods
  print: () => void
  toString: () => string
  toObject: () => this
  toStream: (prefix?: string, prefixStyles?: Type.Styles) => BaseStreamLogger | BrowserStreamLogger

  // Abstract methods
  decorateText: (content: string, styles?: Type.Styles) => string
  printOutput: (output: string) => void
  printDivider: (text: string, styles: Type.Styles) => void

  // Index signature for dynamic property access
  [key: string]: any
}

export interface BaseStreamLogger extends BaseLogger {
  // Stream-specific methods
  delay: (delay: number) => this
  state: (state: 'start' | 'stop' | 'succeed' | 'fail') => this
  update: () => this
  asyncUpdate: (delay?: number) => Promise<void>

  // Override BaseLogger methods to return this for chaining
  text: (...args: any[]) => this
  detail: (detail?: string, styles?: Type.Styles) => this
  prefix: (prefix: string, styles?: Type.Styles) => this
  data: (...dataItems: any[]) => this
  time: (isDisplay?: boolean) => this
  valid: (isValid?: boolean) => this
  styles: (styles: Type.Styles) => this
  prependDivider: (char?: string, length?: number, styles?: Type.Styles) => this
  appendDivider: (char?: string, length?: number, styles?: Type.Styles) => this

  // Abstract stream methods
  initializeStream: () => void
  updateStream: (output: string) => void
  finalizeStream: (state: 'start' | 'stop' | 'succeed' | 'fail', output: string) => void

  // Convenience methods for common stream states
  succeed: (output?: string) => this
  fail: (output?: string) => this
  start: (output?: string) => this
  stop: (output?: string) => this
}

// Browser-specific stream logger interface with void returns for action methods
export interface BrowserStreamLogger extends Omit<BaseStreamLogger, 'state' | 'succeed' | 'fail' | 'start' | 'stop' | 'update'> {
  // Action methods return void in browser environments
  state: (state: 'start' | 'stop' | 'succeed' | 'fail') => void
  update: () => void
  succeed: (output?: string) => void
  fail: (output?: string) => void
  start: (output?: string) => void
  stop: (output?: string) => void
}

// Main Type namespace containing all type definitions
export namespace Type {
  // =============================================================================
  // CORE LOGGER TYPES
  // =============================================================================

  /** Predefined log types available in the logger */
  export type PresetTypes =
    | 'info'
    | 'warn'
    | 'error'
    | 'debug'
    | 'success'
    | 'failure'
    | 'plain'

  /** Union type for all possible logger types */
  export type Type = PresetTypes | string | symbol

  // =============================================================================
  // STYLING TYPES
  // =============================================================================

  /** Individual style property from Chalk.js */
  export type Style = keyof ChalkInstance

  /** Array of style properties for combining multiple styles */
  export type Styles = Style[]

  /** Map of logger types to their default styles */
  export type StylesMap = Record<Type | string, Styles>

  // =============================================================================
  // CUSTOM TYPE CREATION
  // =============================================================================

  /** Function signature for creating custom logger types */
  export type CreateCustomType = (styles: Styles) => BaseLogger

  /** Record of custom logger types */
  export type CustomTypes = Record<string, CreateCustomType>

  // =============================================================================
  // STREAM LOGGER TYPES
  // =============================================================================

  /** Possible states for stream loggers */
  export type StreamLoggerState = 'start' | 'stop' | 'succeed' | 'fail'

  /** Logger type indicator */
  export type LoggerType = 'normal' | 'stream'

  // =============================================================================
  // BROWSER-SPECIFIC TYPES
  // =============================================================================

  /** Browser console styling result */
  export interface BrowserStyleResult {
    text: string
    styles?: string
  }

  /** Browser storage estimate interface */
  export interface StorageEstimate {
    quota?: number
    usage?: number
  }

  /** Navigator storage interface */
  export interface NavigatorStorage {
    // eslint-disable-next-line ts/method-signature-style
    estimate(): Promise<StorageEstimate>
  }

  // =============================================================================
  // NODE.JS-SPECIFIC TYPES
  // =============================================================================

  /** Ora spinner instance type (re-exported for convenience) */
  export type OraInstance = Ora

  // =============================================================================
  // ENVIRONMENT TYPES
  // =============================================================================

  /** Runtime environment detection */
  export type Environment = 'browser' | 'node' | 'bun' | 'unknown'

  // =============================================================================
  // UTILITY TYPES
  // =============================================================================

  /** Generic data logging interface */
  export interface LogData<T = any> {
    data: T
    timestamp?: Date
    level?: PresetTypes
  }

  /** API response structure for typed logging */
  export interface ApiResponse<T = any> {
    data: T
    status: number
    message: string
    timestamp?: string
  }

  /** Logger configuration options */
  export interface LoggerConfig {
    enableTime?: boolean
    defaultStyles?: Styles
    environment?: Environment
  }

  /** Stream logger configuration */
  export interface StreamLoggerConfig extends LoggerConfig {
    prefix?: string
    prefixStyles?: Styles
    autoStart?: boolean
  }
}
