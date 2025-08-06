# Custom Types

One of the most powerful features of `@shermant/logger` is the ability to create and register custom log types. This allows you to extend the logger with your own styling and behavior patterns.

## Overview

Custom log types allow you to:
- Define your own log categories with unique styling
- Create domain-specific loggers for different parts of your application
- Maintain consistent styling across your codebase
- Extend the logger's functionality without modifying the core library

## Creating Custom Types

### Basic Custom Type

The simplest way to create a custom type is using the `type()` method:

```typescript
import { logger } from '@shermant/logger'

// Create a custom type with specific styling
logger.type('security', ['bgRed', 'bold', 'white'])
  .prefix('🔒 SECURITY')
  .text('Authentication failed')
  .print()

// Once created, you can reuse the type
logger.type('security')
  .prefix('🔒 SECURITY')
  .text('Unauthorized access attempt')
  .print()
```

### Advanced Custom Type Creation

For more complex scenarios, you can create a logger factory with predefined custom types:

```typescript
import { LoggerType, logger } from '@shermant/logger'

// Define custom types interface
interface CustomLogTypes {
  security: LoggerType.CreateCustomType
  performance: LoggerType.CreateCustomType
  audit: LoggerType.CreateCustomType
  api: LoggerType.CreateCustomType
}

// Create logger with custom types
const customLogger = logger.createLogger<CustomLogTypes>()

// Define and use custom types
customLogger
  .security(['bgRed', 'bold', 'white'])
  .prefix('🔒 SECURITY')
  .text('Security event detected')
  .print()

customLogger
  .performance(['bgYellow', 'black'])
  .prefix('⚡ PERF')
  .text('Performance warning')
  .print()

customLogger
  .audit(['bgMagenta', 'white'])
  .prefix('📋 AUDIT')
  .text('User action logged')
  .print()

customLogger
  .api(['bgCyan', 'black'])
  .prefix('📡 API')
  .text('API request processed')
  .print()
```

## Styling Options

### Available Styles

Custom types support all Chalk.js styling options:

```typescript
import { logger } from '@shermant/logger'

// Text colors
logger.type('info-blue', ['blue']).text('Blue text').print()
logger.type('info-red', ['red']).text('Red text').print()
logger.type('info-green', ['green']).text('Green text').print()

// Background colors
logger.type('bg-yellow', ['bgYellow', 'black']).text('Yellow background').print()
logger.type('bg-magenta', ['bgMagenta', 'white']).text('Magenta background').print()

// Text decorations
logger.type('bold-text', ['bold']).text('Bold text').print()
logger.type('italic-text', ['italic']).text('Italic text').print()
logger.type('underline-text', ['underline']).text('Underlined text').print()

// Combinations
logger.type('fancy', ['bgBlue', 'white', 'bold', 'underline'])
  .text('Fancy styled text')
  .print()
```

### Bright Colors

```typescript
import { logger } from '@shermant/logger'

// Bright text colors
logger.type('bright-red', ['redBright']).text('Bright red text').print()
logger.type('bright-green', ['greenBright']).text('Bright green text').print()
logger.type('bright-blue', ['blueBright']).text('Bright blue text').print()

// Bright background colors
logger.type('bright-bg', ['bgRedBright', 'white']).text('Bright red background').print()
logger.type('bright-bg-green', ['bgGreenBright', 'black']).text('Bright green background').print()
```

## Domain-Specific Loggers

### Application Domains

Create loggers for different parts of your application:

```typescript
import { logger } from '@shermant/logger'

// Database operations
logger.type('database', ['bgBlue', 'white'])
const dbLogger = logger.type('database')

dbLogger.prefix('🗄️  DB').text('Connection established').print()
dbLogger.prefix('🗄️  DB').text('Query executed successfully').print()
dbLogger.prefix('🗄️  DB').text('Transaction committed').print()

// Authentication system
logger.type('auth', ['bgGreen', 'black'])
const authLogger = logger.type('auth')

authLogger.prefix('🔐 AUTH').text('User logged in').print()
authLogger.prefix('🔐 AUTH').text('Token refreshed').print()
authLogger.prefix('🔐 AUTH').text('Session expired').print()

// Payment processing
logger.type('payment', ['bgYellow', 'black'])
const paymentLogger = logger.type('payment')

paymentLogger.prefix('💳 PAY').text('Payment initiated').print()
paymentLogger.prefix('💳 PAY').text('Payment processed').print()
paymentLogger.prefix('💳 PAY').text('Payment confirmed').print()
```

### Microservices Logging

```typescript
import { logger } from '@shermant/logger'

// Service-specific loggers
function createServiceLogger(serviceName: string, color: string) {
  logger.type(serviceName, [color, 'white'])
  return logger.type(serviceName)
}

// User service
const userService = createServiceLogger('user-service', 'bgBlue')
userService.prefix('👤 USER-SVC').text('User created').print()

// Order service
const orderService = createServiceLogger('order-service', 'bgGreen')
orderService.prefix('📦 ORDER-SVC').text('Order processed').print()

// Notification service
const notificationService = createServiceLogger('notification-service', 'bgMagenta')
notificationService.prefix('📧 NOTIF-SVC').text('Email sent').print()
```

## Log Level Hierarchies

### Creating Log Level Systems

```typescript
import { logger } from '@shermant/logger'

// Create a hierarchical logging system
class CustomLogger {
  // Critical level (highest priority)
  static critical = logger.type('critical', ['bgRed', 'white', 'bold'])

  // Error level
  static error = logger.type('error', ['bgRed', 'white'])

  // Warning level
  static warning = logger.type('warning', ['bgYellow', 'black'])

  // Info level
  static info = logger.type('info', ['bgBlue', 'white'])

  // Debug level
  static debug = logger.type('debug', ['bgMagenta', 'white'])

  // Trace level (lowest priority)
  static trace = logger.type('trace', ['gray'])
}

// Usage
CustomLogger.critical.prefix('🚨 CRITICAL').text('System failure detected').print()
CustomLogger.error.prefix('❌ ERROR').text('Operation failed').print()
CustomLogger.warning.prefix('⚠️  WARNING').text('Deprecated API used').print()
CustomLogger.info.prefix('ℹ️  INFO').text('Process started').print()
CustomLogger.debug.prefix('🐛 DEBUG').text('Variable state').print()
CustomLogger.trace.prefix('🔍 TRACE').text('Function entry').print()
```

### Environment-Based Logging

```typescript
import { logger } from '@shermant/logger'

// Environment-specific custom types
function createEnvironmentLogger(env: 'development' | 'staging' | 'production') {
  switch (env) {
    case 'development':
      return {
        dev: logger.type('dev', ['bgGreen', 'black']),
        devError: logger.type('dev-error', ['bgRed', 'white', 'bold']),
        devDebug: logger.type('dev-debug', ['bgMagenta', 'white'])
      }
    case 'staging':
      return {
        staging: logger.type('staging', ['bgYellow', 'black']),
        stagingError: logger.type('staging-error', ['bgRed', 'white'])
      }
    case 'production':
      return {
        prod: logger.type('prod', ['bgBlue', 'white']),
        prodError: logger.type('prod-error', ['bgRed', 'white', 'bold'])
      }
  }
}

// Usage
const envLogger = createEnvironmentLogger('development')
envLogger.dev.prefix('🔧 DEV').text('Development server started').print()
envLogger.devDebug.prefix('🐛 DEBUG').text('Debugging information').print()
```

## Advanced Patterns

### Factory Pattern

```typescript
import { LoggerType, logger } from '@shermant/logger'

// Logger factory for consistent styling
class LoggerFactory {
  private static typeCounter = 0

  static createCustomType(
    name: string,
    styles: LoggerType.Style[],
    defaultPrefix?: string
  ) {
    const typeName = `${name}-${++this.typeCounter}`
    logger.type(typeName, styles)

    const customLogger = logger.type(typeName)

    if (defaultPrefix) {
      return customLogger.prefix(defaultPrefix)
    }

    return customLogger
  }

  static createModuleLogger(moduleName: string) {
    return this.createCustomType(
      moduleName,
      ['bgCyan', 'black'],
      `📦 ${moduleName.toUpperCase()}`
    )
  }

  static createErrorLogger(context: string) {
    return this.createCustomType(
      `${context}-error`,
      ['bgRed', 'white', 'bold'],
      `❌ ${context.toUpperCase()}`
    )
  }
}

// Usage
const moduleLogger = LoggerFactory.createModuleLogger('auth')
moduleLogger.text('Authentication module loaded').print()

const errorLogger = LoggerFactory.createErrorLogger('database')
errorLogger.text('Connection failed').print()
```

### Decorator Pattern

```typescript
import { logger } from '@shermant/logger'

// Logger decorator for classes
function LoggerDecorator(logType: string, styles: LoggerType.Style[]) {
  return function <T extends { new (...args: any[]): object }>(constructor: T) {
    logger.type(logType, styles)

    return class extends constructor {
      private logger = logger.type(logType)

      log(message: string, prefix?: string) {
        if (prefix) {
          this.logger.prefix(prefix).text(message).print()
        }
        else {
          this.logger.text(message).print()
        }
      }
    }
  }
}

// Usage
@LoggerDecorator('user-service', ['bgBlue', 'white'])
class UserService {
  createUser(userData: any) {
    (this as any).log('Creating new user', '👤 USER')
    // User creation logic
    (this as any).log('User created successfully', '✅ SUCCESS')
  }
}
```

### Mixin Pattern

```typescript
import { LoggerType, logger } from '@shermant/logger'

// Logger mixin
interface LoggerMixin {
  logInfo: (message: string) => void
  logError: (message: string) => void
  logSuccess: (message: string) => void
}

function withLogger<T extends { new (...args: any[]): object }>(
  Base: T,
  loggerName: string
): T & { new (...args: any[]): LoggerMixin } {
  // Create custom types for this mixin
  logger.type(`${loggerName}-info`, ['bgBlue', 'white'])
  logger.type(`${loggerName}-error`, ['bgRed', 'white'])
  logger.type(`${loggerName}-success`, ['bgGreen', 'black'])

  return class extends Base {
    logInfo(message: string) {
      logger.type(`${loggerName}-info`)
        .prefix(`ℹ️  ${loggerName.toUpperCase()}`)
        .text(message)
        .print()
    }

    logError(message: string) {
      logger.type(`${loggerName}-error`)
        .prefix(`❌ ${loggerName.toUpperCase()}`)
        .text(message)
        .print()
    }

    logSuccess(message: string) {
      logger.type(`${loggerName}-success`)
        .prefix(`✅ ${loggerName.toUpperCase()}`)
        .text(message)
        .print()
    }
  }
}

// Usage
class BaseService {}

class UserService extends withLogger(BaseService, 'user') {
  createUser() {
    this.logInfo('Starting user creation')
    // Logic here
    this.logSuccess('User created successfully')
  }
}
```

## Best Practices

### Naming Conventions

```typescript
import { logger } from '@shermant/logger'

// Use descriptive names
logger.type('api-request', ['bgCyan', 'black'])
logger.type('database-query', ['bgBlue', 'white'])
logger.type('security-alert', ['bgRed', 'white', 'bold'])

// Use consistent prefixes for related types
logger.type('auth-login', ['bgGreen', 'black'])
logger.type('auth-logout', ['bgYellow', 'black'])
logger.type('auth-error', ['bgRed', 'white'])

// Use semantic naming
logger.type('critical-error', ['bgRed', 'white', 'bold'])
logger.type('performance-warning', ['bgYellow', 'black'])
logger.type('debug-trace', ['gray'])
```

### Style Consistency

```typescript
import { logger } from '@shermant/logger'

// Define a style guide
const StyleGuide = {
  // Error levels
  critical: ['bgRed', 'white', 'bold'] as const,
  error: ['bgRed', 'white'] as const,
  warning: ['bgYellow', 'black'] as const,

  // Information levels
  info: ['bgBlue', 'white'] as const,
  success: ['bgGreen', 'black'] as const,
  debug: ['bgMagenta', 'white'] as const,

  // Domain colors
  database: ['bgBlue', 'white'] as const,
  auth: ['bgGreen', 'black'] as const,
  api: ['bgCyan', 'black'] as const,
  security: ['bgRed', 'white', 'bold'] as const
}

// Apply consistent styling
logger.type('db-error', StyleGuide.error)
logger.type('auth-success', StyleGuide.success)
logger.type('api-info', StyleGuide.info)
```

### Type Registration

```typescript
import { logger } from '@shermant/logger'

// Centralized type registration
class LoggerTypes {
  static register() {
    // Application domains
    logger.type('auth', ['bgGreen', 'black'])
    logger.type('database', ['bgBlue', 'white'])
    logger.type('api', ['bgCyan', 'black'])
    logger.type('security', ['bgRed', 'white', 'bold'])

    // Log levels
    logger.type('critical', ['bgRed', 'white', 'bold'])
    logger.type('performance', ['bgYellow', 'black'])
    logger.type('audit', ['bgMagenta', 'white'])
  }

  // Getter methods for type safety
  static get auth() { return logger.type('auth') }
  static get database() { return logger.type('database') }
  static get api() { return logger.type('api') }
  static get security() { return logger.type('security') }
  static get critical() { return logger.type('critical') }
  static get performance() { return logger.type('performance') }
  static get audit() { return logger.type('audit') }
}

// Initialize types at application startup
LoggerTypes.register()

// Usage throughout the application
LoggerTypes.auth.prefix('🔐 AUTH').text('User authenticated').print()
LoggerTypes.database.prefix('🗄️  DB').text('Query executed').print()
LoggerTypes.security.prefix('🚨 SECURITY').text('Threat detected').print()
```

Custom types provide a powerful way to extend `@shermant/logger` and create a consistent, maintainable logging system throughout your application. By following these patterns and best practices, you can build a robust logging infrastructure that scales with your project.
