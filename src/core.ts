import { Logger as UnifiedLogger, StreamLogger as UnifiedStreamLogger } from './logger-factory'

// Re-export the unified logger classes that use the factory pattern internally
export const Logger = UnifiedLogger
export const StreamLogger = UnifiedStreamLogger
