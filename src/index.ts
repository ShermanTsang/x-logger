// Main logger classes using factory pattern for environment detection
export { Logger, StreamLogger } from './logger-factory'

// Custom type creation and accessor utilities
export { createLoggerWithCustomType as createLogger, accessor as logger } from './wrapper'

// Utility functions
export { safeNavigator, isBrowser, isNode } from './utils'

// Type definitions for TypeScript users
export type { BaseLogger, BaseStreamLogger, Type } from './typings'

// Re-export commonly used types for convenience
export type {
  Type as LoggerType,
} from './typings'
