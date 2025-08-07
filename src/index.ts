// Main logger classes using factory pattern for environment detection
export { Logger, StreamLogger } from './logger-factory.ts'

// Custom type creation and accessor utilities
export { createLoggerWithCustomType as createLogger } from './wrapper.ts'
export { accessor as logger } from './accessor.ts'

// Utility functions
export { safeNavigator } from './utils.ts'
export { isBrowser, isNode } from './environment.ts'
