import { logger } from './src/index.js';

console.log('Testing logger immutability...');

const baseLogger = logger.info;
console.log('baseLogger:', baseLogger);
console.log('baseLogger constructor:', baseLogger.constructor.name);

const modifiedLogger = baseLogger.prefix('TEST');
console.log('modifiedLogger:', modifiedLogger);
console.log('modifiedLogger constructor:', modifiedLogger.constructor.name);

console.log('Are they the same instance?', baseLogger === modifiedLogger);
console.log('Are they different instances?', baseLogger !== modifiedLogger);

console.log('baseLogger.toString():', baseLogger.toString());
console.log('modifiedLogger.toString():', modifiedLogger.toString());
console.log('Are toString() outputs different?', baseLogger.toString() !== modifiedLogger.toString());