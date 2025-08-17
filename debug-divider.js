import { logger } from './src/index.js'

// Reproduce the failing test
logger.info.divider('-')
const result = logger.info.prependDivider().toString()

console.log('Result:')
console.log(JSON.stringify(result))
console.log('Split by newlines:')
console.log(result.split('\n'))
console.log('Length:', result.split('\n').length)
