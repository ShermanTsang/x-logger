# TypeScript Support

`@shermant/logger` is built with TypeScript from the ground up, providing excellent type safety and IntelliSense support. This guide covers all TypeScript-specific features and usage patterns.

## Type Safety

The library provides comprehensive type definitions for all APIs, ensuring compile-time safety and excellent developer experience.

### Basic Type Safety

```typescript
import { Logger, logger } from '@shermant/logger'

// All methods are fully typed
logger.info
  .prefix('string only') // ✅ string parameter
  .text('message') // ✅ string parameter
  .time(true) // ✅ boolean parameter
  .print() // ✅ no parameters

// TypeScript will catch errors
logger.info
  .prefix(123) // ❌ Type error: number not assignable to string
  .time('invalid') // ❌ Type error: string not assignable to boolean
```

### Logger Instance Types

```typescript
import { Logger, LoggerType } from '@shermant/logger'

// Logger instance type
const loggerInstance: Logger = Logger.info

// Method return types are properly typed
const withPrefix: Logger = logger.info.prefix('API')
const withText: Logger = withPrefix.text('Request completed')
```

## Custom Type Definitions

### Creating Custom Log Types

The library provides type-safe ways to create custom log types:

```typescript
import { LoggerType, logger } from '@shermant/logger'

// Define custom type with proper typing
interface CustomLogTypes {
  security: LoggerType.CreateCustomType
  performance: LoggerType.CreateCustomType
  audit: LoggerType.CreateCustomType
}

// Create logger with custom types
const customLogger = logger.createLogger<CustomLogTypes>()

// Use custom types with full type safety
customLogger
  .security(['bgRed', 'bold', 'white'])
  .prefix('🔒 SECURITY')
  .text('Authentication failed')
  .print()

customLogger
  .performance(['bgYellow', 'black'])
  .prefix('⚡ PERF')
  .text('Slow operation detected')
  .print()
```

### Style Type Definitions

```typescript
import { LoggerType } from '@shermant/logger'

// Style types are based on Chalk.js
type ValidStyles = LoggerType.Style[]

const redBackground: ValidStyles = ['bgRed', 'white']
const boldText: ValidStyles = ['bold', 'underline']
const coloredText: ValidStyles = ['blue', 'italic']

// Use with type safety
logger.type('custom', redBackground)
  .text('Styled message')
  .print()
```

## Interface Definitions

### Core Interfaces

```typescript
// Logger interface
interface Logger {
  // Predefined log types
  info: Logger
  warn: Logger
  error: Logger
  debug: Logger
  success: Logger
  failure: Logger
  plain: Logger

  // Configuration methods
  prefix: (text: string) => Logger
  text: (message: string) => Logger
  detail: (detail: string) => Logger
  data: (data: any) => Logger
  time: (show?: boolean) => Logger

  // Styling methods
  style: (styles: LoggerType.Style[]) => Logger
  type: (name: string, styles?: LoggerType.Style[]) => Logger

  // Output methods
  print: (condition?: boolean) => void
  divider: (char?: string, length?: number) => void

  // Utility methods
  prependDivider: (char?: string, length?: number) => Logger
  appendDivider: (char?: string, length?: number) => Logger
}

// Stream Logger interface
interface StreamLogger {
  prefix: (text: string) => StreamLogger
  text: (message: string) => StreamLogger
  detail: (detail: string) => StreamLogger
  style: (styles: LoggerType.Style[]) => StreamLogger

  // Stream-specific methods
  update: () => StreamLogger
  state: (state: 'start' | 'stop' | 'succeed' | 'fail') => StreamLogger
  delay: (ms: number) => StreamLogger
}
```

### Type Namespace

```typescript
namespace LoggerType {
  // Style types from Chalk.js
  type Style =
    | 'reset' | 'bold' | 'dim' | 'italic' | 'underline' | 'inverse'
    | 'hidden' | 'strikethrough' | 'visible'
    | 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white'
    | 'gray' | 'grey' | 'blackBright' | 'redBright' | 'greenBright'
    | 'yellowBright' | 'blueBright' | 'magentaBright' | 'cyanBright' | 'whiteBright'
    | 'bgBlack' | 'bgRed' | 'bgGreen' | 'bgYellow' | 'bgBlue' | 'bgMagenta'
    | 'bgCyan' | 'bgWhite' | 'bgGray' | 'bgGrey' | 'bgBlackBright'
    | 'bgRedBright' | 'bgGreenBright' | 'bgYellowBright' | 'bgBlueBright'
    | 'bgMagentaBright' | 'bgCyanBright' | 'bgWhiteBright'

  type Styles = Style[]

  // Custom type creation
  type CreateCustomType = (styles: Styles) => Logger

  // Log levels
  type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success' | 'failure' | 'plain'

  // Stream states
  type StreamState = 'start' | 'stop' | 'succeed' | 'fail'
}
```

## Advanced TypeScript Features

### Generic Type Support

```typescript
import { logger } from '@shermant/logger'

// Generic data logging with type safety
interface UserData {
  id: number
  name: string
  email: string
}

interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

function logApiResponse<T>(response: ApiResponse<T>) {
  logger.info
    .prefix('📡 API')
    .text('Response received')
    .detail(`Status: ${response.status}`)
    .detail(`Message: ${response.message}`)
    .data(response.data) // T is properly typed
    .print()
}

// Usage with type safety
const userResponse: ApiResponse<UserData> = {
  data: { id: 1, name: 'John', email: 'john@example.com' },
  status: 200,
  message: 'Success'
}

logApiResponse(userResponse) // ✅ Fully typed
```

### Conditional Types

```typescript
import { LoggerType, logger } from '@shermant/logger'

// Conditional logging based on environment
type LoggerConfig<T extends 'development' | 'production'> = T extends 'development'
  ? { verbose: true, colors: true }
  : { verbose: false, colors: false }

function createEnvironmentLogger<T extends 'development' | 'production'>(
  env: T,
  config: LoggerConfig<T>
) {
  if (config.verbose) {
    return logger.debug // Development logger
  }
  return logger.info // Production logger
}

// Type-safe environment logging
const devLogger = createEnvironmentLogger('development', { verbose: true, colors: true })
const prodLogger = createEnvironmentLogger('production', { verbose: false, colors: false })
```

### Utility Types

```typescript
import { Logger, LoggerType } from '@shermant/logger'

// Extract log level from logger instance
type ExtractLogLevel<T> = T extends Logger ? LoggerType.LogLevel : never

// Create logger factory with specific types
type LoggerFactory<T extends Record<string, LoggerType.CreateCustomType>> = {
  [K in keyof T]: T[K]
} & Logger

// Helper type for style validation
type ValidateStyles<T extends LoggerType.Style[]> = T

// Usage
const validStyles: ValidateStyles<['bgBlue', 'white']> = ['bgBlue', 'white'] // ✅
// const invalidStyles: ValidateStyles<['invalid']> = ['invalid']  // ❌ Type error
```

## Type Guards and Validation

### Runtime Type Checking

```typescript
import { logger } from '@shermant/logger'

// Type guard for log data
function isValidLogData(data: unknown): data is Record<string, any> {
  return typeof data === 'object' && data !== null
}

// Safe logging with type guards
function safeLog(message: string, data?: unknown) {
  const logInstance = logger.info.text(message)

  if (data !== undefined && isValidLogData(data)) {
    logInstance.data(data).print()
  }
  else {
    logInstance.print()
  }
}

// Usage
safeLog('User created', { id: 1, name: 'John' }) // ✅ Valid data
safeLog('Simple message') // ✅ No data
safeLog('Invalid data', 'string') // ✅ Handled safely
```

### Environment Type Detection

```typescript
import { logger } from '@shermant/logger'

// Environment detection with types
type Environment = 'browser' | 'node' | 'bun' | 'unknown'

function detectEnvironment(): Environment {
  if (typeof window !== 'undefined')
    return 'browser'
  if (typeof process !== 'undefined' && process.versions?.node)
    return 'node'
  if (typeof process !== 'undefined' && process.versions?.bun)
    return 'bun'
  return 'unknown'
}

// Environment-specific logging
function logWithEnvironment(message: string) {
  const env = detectEnvironment()

  logger.info
    .prefix(`🌍 ${env.toUpperCase()}`)
    .text(message)
    .detail(`Environment: ${env}`)
    .print()
}
```

## Integration with Popular TypeScript Frameworks

### Express.js with TypeScript

```typescript
import express, { NextFunction, Request, Response } from 'express'
import { logger } from '@shermant/logger'

interface LoggedRequest extends Request {
  startTime: number
}

// Typed middleware
function loggingMiddleware(req: LoggedRequest, res: Response, next: NextFunction) {
  req.startTime = Date.now()

  logger.info
    .prefix('📡 REQUEST')
    .text(`${req.method} ${req.path}`)
    .detail(`IP: ${req.ip}`)
    .time()
    .print()

  next()
}

// Typed error handler
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error
    .prefix('❌ ERROR')
    .text('Request failed')
    .detail(`Route: ${req.path}`)
    .detail(`Error: ${err.message}`)
    .data({ stack: err.stack })
    .print()

  res.status(500).json({ error: 'Internal server error' })
}
```

### NestJS Integration

```typescript
import { Injectable, Logger as NestLogger } from '@nestjs/common'
import { logger } from '@shermant/logger'

@Injectable()
export class CustomLoggerService {
  private readonly logger = new NestLogger(CustomLoggerService.name)

  log(message: string, context?: string) {
    logger.info
      .prefix(context || 'APP')
      .text(message)
      .time()
      .print()
  }

  error(message: string, trace?: string, context?: string) {
    logger.error
      .prefix(context || 'ERROR')
      .text(message)
      .detail(trace || 'No stack trace')
      .time()
      .print()
  }

  warn(message: string, context?: string) {
    logger.warn
      .prefix(context || 'WARN')
      .text(message)
      .time()
      .print()
  }
}
```

## Best Practices

### Type-Safe Configuration

```typescript
import { LoggerType, logger } from '@shermant/logger'

// Configuration interface
interface LoggerConfiguration {
  level: LoggerType.LogLevel
  prefix: string
  showTime: boolean
  styles: LoggerType.Style[]
}

// Factory function with type safety
function createConfiguredLogger(config: LoggerConfiguration) {
  return logger
    .type(config.level, config.styles)
    .prefix(config.prefix)
    .time(config.showTime)
}

// Usage with type safety
const apiLogger = createConfiguredLogger({
  level: 'info',
  prefix: '📡 API',
  showTime: true,
  styles: ['bgBlue', 'white']
})
```

### Strict Type Checking

```typescript
// Enable strict mode in tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}

// All logger usage will be strictly typed
import { logger } from '@shermant/logger'

// This will work with strict typing
logger.info
  .prefix('STRICT')      // string required
  .text('message')       // string required
  .time(true)           // boolean required
  .print()              // no parameters
```

The TypeScript support in `@shermant/logger` ensures that you get the best possible developer experience with full type safety, excellent IntelliSense, and compile-time error checking.
