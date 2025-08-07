// Main logger classes using factory pattern for environment detection
export { Logger, StreamLogger } from './logger-factory'

// Custom type creation and accessor utilities
export { createLoggerWithCustomType as createLogger } from './wrapper'
export { accessor as logger } from './accessor'

// Utility functions
export { safeNavigator } from './utils'
export { isBrowser, isNode } from './environment'

// Type definitions for TypeScript users
export type { BaseLogger, BaseStreamLogger, Type } from './typings'

// Re-export commonly used types for convenience
export type {
  Type as LoggerType,
} from './typings'
