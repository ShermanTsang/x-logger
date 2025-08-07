import type { ChalkInstance } from 'chalk'
import type { Ora } from 'ora'

// Forward declarations for circular dependency resolution
export interface BaseLogger {
  // Core methods
  text: (text: string, styles?: Type.Styles) => BaseLogger
  detail: (detail: string, styles?: Type.Styles) => BaseLogger
  prefix: (prefix: string, styles?: Type.Styles) => BaseLogger
  data: (data: any) => BaseLogger
  time: (isDisplay?: boolean) => BaseLogger
  styles: (styles: Type.Styles) => BaseLogger

  // Divider methods
  divider: (char?: string, length?: number, styles?: Type.Styles) => void
  prependDivider: (char?: string, length?: number, styles?: Type.Styles) => BaseLogger
  appendDivider: (char?: string, length?: number, styles?: Type.Styles) => BaseLogger

  // Output methods
  print: (isVisible?: boolean) => void
  toString: () => string
  toObject: () => BaseLogger
  toStream: (prefix?: string, prefixStyles?: Type.Styles) => BaseStreamLogger

  // Abstract methods
  decorateText: (content: string, styles?: Type.Styles) => string
  printOutput: (output: string) => void
  printDivider: (text: string, styles: Type.Styles) => void
}

export interface BaseStreamLogger extends BaseLogger {
  // Stream-specific methods
  delay: (delay: number) => BaseStreamLogger
  state: (state: Type.StreamLoggerState) => BaseStreamLogger
  update: () => void
  asyncUpdate: (delay?: number) => Promise<void>

  // Abstract stream methods
  initializeStream: () => void
  updateStream: (output: string) => void
  finalizeStream: (state: Type.StreamLoggerState, output: string) => void
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
