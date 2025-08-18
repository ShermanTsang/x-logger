export { Logger, StreamLogger } from './logger-factory';
export { createLoggerWithCustomType as createLogger, accessor as logger } from './wrapper';
export { safeNavigator, isBrowser, isNode } from './utils';
export type { BaseLogger, BaseStreamLogger, Type } from './typings';
export type { Type as LoggerType, } from './typings';
