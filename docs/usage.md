# API Reference & Usage

This guide covers all the features and methods available in `@shermant/logger`. The library provides a fluent, chainable API that makes logging both powerful and intuitive.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Logger Invocation Methods](#logger-invocation-methods)
- [Logger Class](#logger-class)
- [Predefined Log Types](#predefined-log-types)
- [Custom Log Types](#custom-log-types)
- [Styling and Formatting](#styling-and-formatting)
- [Stream Logger](#stream-logger)
- [Advanced Features](#advanced-features)
- [TypeScript Support](#typescript-support)

## Basic Usage

The simplest way to use the logger is through the predefined log types. Each type has its own styling and is designed for specific use cases.

```typescript
import { logger } from '@shermant/logger'

// Simple logging
logger.info.text('Application started').print()
logger.warn.text('This is a warning').print()
logger.error.text('Something went wrong').print()
logger.success.text('Operation completed').print()
```

## Logger Invocation Methods

Sherman Logger provides multiple flexible ways to invoke logger instances, each suited for different use cases and coding styles. This section covers all the available invocation patterns.

### 1. Direct Predefined Type Access

The most common and straightforward way to use the logger is through direct access to predefined log types:

```typescript
import { logger } from '@shermant/logger'

// Direct type access - most common pattern
logger.info.text('Application started').print()
logger.warn.text('Warning message').print()
logger.error.text('Error occurred').print()
logger.success.text('Operation successful').print()
logger.debug.text('Debug information').print()
logger.failure.text('Operation failed').print()
logger.plain.text('Plain text without styling').print()
```

### 2. Type Method Invocation

Use the `type()` method to specify log types dynamically or create custom types:

```typescript
import { logger } from '@shermant/logger'

// Using type() method with predefined types
logger.type('info').text('Dynamic type selection').print()
logger.type('warn').text('Dynamic warning').print()

// Creating custom types on-the-fly
logger.type('custom', ['bgMagenta', 'bold']).text('Custom styled message').print()
logger.type('security', ['bgRed', 'white']).text('Security alert').print()
```

### 3. Logger Class Static Methods

Import and use the `Logger` class directly for more control:

```typescript
import { Logger } from '@shermant/logger'

// Using Logger class static methods
Logger.info.text('Class-based logging').print()
Logger.type('custom', ['bgBlue']).text('Custom type via class').print()

// Create reusable logger instances
const appLogger = Logger.type('info').prefix('APP').time()
appLogger.text('First message').print()
appLogger.text('Second message').print()
```

### 4. Factory Pattern with createLogger

Create logger instances with predefined custom types using the factory pattern:

```typescript
import { createLogger } from '@shermant/logger'
import type { LoggerType } from '@shermant/logger'

// Define custom types at creation time
const customLogger = createLogger<{
  security: LoggerType.CreateCustomType
  performance: LoggerType.CreateCustomType
}>()

// Use the custom types
customLogger.security(['bgRed', 'bold']).text('Security event').print()
customLogger.performance(['bgYellow', 'black']).text('Performance metric').print()

// Later use with type() method
customLogger.type('security').text('Another security event').print()
```

### 5. Callable Logger Instances

Logger instances are callable functions that can be invoked directly:

```typescript
import { logger } from '@shermant/logger'

// Get a logger instance
const infoLogger = logger.info

// Call it as a function with text parameters
infoLogger('Simple message')
infoLogger('Multiple', 'parameters', 'supported')
infoLogger('User', 123, 'logged in')

// Still chainable for complex scenarios
infoLogger.prefix('APP').text('Complex message').print()
```

### 6. Method Chaining Patterns

All logger invocation methods support fluent method chaining:

```typescript
import { logger } from '@shermant/logger'

// Chain multiple configuration methods
logger.info
  .prefix('🚀 SERVER')
  .text('Starting application')
  .detail('Port: 3000')
  .time()
  .print()

// Chain with custom types
logger
  .type('deployment', ['bgGreen', 'bold'])
  .prefix('🚀 DEPLOY')
  .text('Application deployed successfully')
  .detail('Version: 1.2.3')
  .data({ environment: 'production', region: 'us-east-1' })
  .print()
```

### 7. Conditional Logging

All invocation methods support conditional logging:

```typescript
import { logger } from '@shermant/logger'

const isDevelopment = process.env.NODE_ENV === 'development'
const isVerbose = process.env.VERBOSE === 'true'

// Conditional printing
logger.debug.text('Debug information').print(isDevelopment)
logger.info.text('Verbose logging').print(isVerbose)

// With callable pattern
const debugLogger = logger.debug
if (isDevelopment) {
  debugLogger('Development mode active')
}
```

### 8. Reusable Logger Configurations

Create reusable logger configurations for consistent formatting:

```typescript
import { Logger } from '@shermant/logger'

// Create base configurations
const apiLogger = Logger.type('info').prefix('🌐 API').time()
const dbLogger = Logger.type('info').prefix('🗄️ DB').time()
const authLogger = Logger.type('security', ['bgRed', 'white']).prefix('🔒 AUTH')

// Use throughout your application
apiLogger.text('Request received').detail('POST /api/users').print()
dbLogger.text('Query executed').detail('SELECT * FROM users').print()
authLogger.text('Login attempt').detail('IP: 192.168.1.100').print()
```

### 9. Stream Logger Invocation

For interactive logging with spinners and real-time updates:

```typescript
import { logger } from '@shermant/logger'

// Get stream logger instance
const stream = logger.stream

// Configure and start
stream.prefix('📦 INSTALL').text('Installing packages...').update()

// Update progress
setTimeout(() => {
  stream.text('Downloading dependencies...').update()
}, 1000)

// Complete
setTimeout(() => {
  stream.text('Installation completed!').state('succeed')
}, 2000)
```

### 10. Environment-Aware Invocation

The logger automatically adapts to different environments:

```typescript
import { logger } from '@shermant/logger'

// Works in both Node.js and browser environments
logger.info.text('Cross-platform logging').print()

// Browser-specific features are automatically handled
logger.stream.text('Progress indicator').update() // Spinner in Node.js, console log in browser
```

### Best Practices for Logger Invocation

1. **Use direct type access** for simple, one-off logging
2. **Use type() method** for dynamic type selection or custom types
3. **Use Logger class** when you need multiple instances with shared configuration
4. **Use createLogger** for applications with many custom log types
5. **Use callable pattern** for simple text logging without additional configuration
6. **Use method chaining** for complex log messages with multiple attributes
7. **Create reusable configurations** for consistent logging across modules

## Predefined Log Types

The library comes with seven predefined log types, each with distinct styling:

| Type | Purpose | Default Style |
|------|---------|---------------|
| `info` | General information | Blue background |
| `warn` | Warnings | Yellow background |
| `error` | Error messages | Red background |
| `debug` | Debug information | Magenta background |
| `success` | Success messages | Green background |
| `failure` | Failure messages | Red background with strikethrough |
| `plain` | Unstyled text | No styling |

### Examples

```typescript
import { logger } from '@shermant/logger'

// Information logging
logger.info
  .prefix('🚀 APP')
  .text('Server starting on port 3000')
  .print()

// Warning with details
logger.warn
  .prefix('⚠️ WARNING')
  .text('Deprecated API usage detected')
  .detail('Please update to the new API')
  .print()

// Error with data
logger.error
  .prefix('❌ ERROR')
  .text('Database connection failed')
  .data({ host: 'localhost', port: 5432 })
  .print()

// Success with timestamp
logger.success
  .prefix('✅ SUCCESS')
  .text('User authentication completed')
  .time()
  .print()
```

## `Logger` class

All functions are provided by the `Logger` class.

When you invoke `Logger` class and chain call `type` function, you have no need to create an instance of the `Logger`
class white `new` EcmaScript syntax.

```typescript
import { Logger } from '@shermant/logger'

// You can use `Logger` instances sharing the same log type and other config options in this way.
const logger = Logger.type('info').time().prependDivider('♥')
logger.prefix('love').text('the world').print()
logger.prefix('love').text('you').print()
```

## `logger` accessor

You are recommend to use the `logger` accessor to use the `Logger` class.

With the `logger` accessor, you can use the `Logger` class without creating an instance.

```typescript
import { logger } from '@shermant/logger'
```

## `logger.createLogger` function

You can also use the `createLogger` function to predefined a new logger instance with a custom log type.

To implement this, you need to pass a generic type to the `createLogger` function. The generic type is an object that
contains the new log type name and the `LoggerType.CreateCustomType` type.

```typescript
const logger = createLogger<{
  newType: LoggerType.CreateCustomType
}>()

logger
  .newType(['bgGreenBright', 'underline'])
  .prefix('custom logger')
  .text('test adding custom logger type via type function')
  .print()
```

Next time, use `newType` with the `type` function.

```typescript
logger
  .type('newType')
  .prefix('custom logger')
  .text('The next time you can use `newType` with `type` function')
  .print()
```

To use newType directly, cast it to the Logger type. Note that casting to unknown first will disable type prompting and
checking.

However, you need to cast it to `unknown` type first that will make you lose the type prompting and checking service
with `Logger` class.

This is not recommend code style

```typescript
const newType = logger.newType as unknown as Logger
newType
  .prefix('custom logger')
  .text('Also, you can use `newType` directly, but not recommend')
  .print()
```

## `print()` method

Use print() to output the log text to the console. You can pass a boolean value to control whether the log text is
output.

## `type()` method

`type` is a static function that allows you to create a new log type.

### Specify log type

Use `type(string, [styles])` to specify the log type, or you can create custom log type.

```typescript
// You can use the `type` method to specify the log type
logger.type('anyType').prefix('type').text('This is an info text').print()
```

### Override Preset Style

You can override the preset style by using the `style` method. The `style` method takes an array of two strings: the
background color and the text color.

```typescript
import { logger } from '@shermant/logger'

logger.type('info', ['bgRed', 'white']).prefix('info title').text('This is a red info text').print()
```

### Add custom log types

When you use the `type` method to create a new log type, you need to pass two arguments: the type `name` and
the `style`.

```typescript
import { logger } from '@shermant/logger'

// The instance will automatically register a type named `myCustomType`
logger.type('myCustomType', ['bgRed', 'white'])

// Then, you can use `myCustomType` to log messages
logger.type('myCustomType').prefix('custom').text('This is a custom text').print()
```

## `prefix()` method

Use `prefix(string)` to add a prefix to the log text, and the prefix will be displayed in the log text.

In the future, you can use `prefix` attribute to filter log messages.

## `text()` method

Use `text(string)` to add a text to the log text. The method now supports multiple parameters that will be concatenated with spaces.

### Single Parameter

```typescript
import { logger } from '@shermant/logger'

logger.info.prefix('INFO').text('This is a single text message').print()
```

### Multiple Parameters

You can pass multiple parameters to the `text()` method, and they will be concatenated with spaces:

```typescript
import { logger } from '@shermant/logger'

// Multiple string parameters
logger.info.prefix('INFO').text('User', 'authentication', 'completed').print()
// Output: User authentication completed

// Mixed parameter types
logger.info.prefix('DEBUG').text('Processing item', 42, 'of', 100).print()
// Output: Processing item 42 of 100

// With variables
const userId = 'user123'
const action = 'login'
logger.info.prefix('AUTH').text('User', userId, 'performed', action).print()
// Output: User user123 performed login
```

### Emphasize key information

With `[[key infomation]]}` syntax, you can emphasize key information in the log text.

```typescript
import { logger } from '@shermant/logger'

logger.info.prefix('info title').text('This is an info text with [[key information]]').print()
```

Then, the text `formatter` will use `chalk.yellow.underline` style to decorate the key information.

Later, you are able to customize the style and the matched sign of the key information.

## `prependDivider()` & `appendDivider()` method

Use `prependDivider()` to add a divider before the log text.

Use `appendDivider()` to add a divider after the log text.

Both of them receive three optional arguments: `char`, `length`, and `styles`.

The default value of `char` is `-`, the default value of `length` is `80`, and the default value of `styles` is
`['bgWhite', 'black']`.

```typescript
import { logger } from '@shermant/logger'

logger.info.prefix('info title').prependDivider().text('This is an info text').print()
logger.info.prefix('info title').appendDivider().text('This is an info text').print()
```

## `time()` method

If you want to display the log time, you can use the `time()` method.

```typescript
import { logger } from '@shermant/logger'

logger.info.prefix('info title').time().text('This is an info text').print()
```

## `styles()` method

Use `styles()` to add styles to the log text.

Note that the styles will only be applied to the log text without the prefix part.

```typescript
import { logger } from '@shermant/logger'

logger.info.prefix('info title').styles(['bgRed', 'white']).text('This is an info text').print()
```

## `detail()` method

Use `detail()` to add a detail to the log text.

```typescript
import { logger } from '@shermant/logger'

logger.info.prefix('info title').detail('This is a detail').text('This is an info text').print()
```

The detail will be displayed below the main log text.

## `data()` method

Use `data()` method to print your data below the log text. The method supports both single and multiple parameters.

### Single Data Parameter

```typescript
logger.info.prefix('info title').styles(['bgRed', 'white']).text('error data')
  .data({
    error: 'error text',
    status: 500
  }).print()
```

### Multiple Data Parameters

You can pass multiple parameters to the `data()` method, and each will be displayed on separate lines:

```typescript
import { logger } from '@shermant/logger'

// Multiple data items of different types
logger.info
  .prefix('MULTI_DATA')
  .text('Processing multiple data items')
  .data([], 123, 'ok', {})
  .print()

// Output:
// [] 
// 123
// ok
// {}
```

### Mixed Data Types Example

```typescript
const userArray = [1, 2, 3]
const userObject = { name: 'John', age: 30 }
const statusMessage = 'Processing complete'
const responseCode = 200

logger.success
  .prefix('API_RESPONSE')
  .text('Request processed successfully')
  .data(userArray, userObject, statusMessage, responseCode)
  .print()

// Output:
// [
//   1,
//   2,
//   3
// ]
// {
//   "name": "John",
//   "age": 30
// }
// Processing complete
// 200
```

### Backward Compatibility

The method maintains full backward compatibility with existing single-parameter usage:

```typescript
// This still works exactly as before
logger.error
  .prefix('ERROR')
  .text('Database connection failed')
  .data({ error: 'Connection timeout', code: 'DB_TIMEOUT' })
  .print()
```

## `toString()` method

Use `toString()` method to get the formatted and rendered log text.

```typescript
import { logger } from '@shermant/logger'

logger('This is an info [[text]]').toString()
```

## `StreamLogger` class

The `StreamLogger` class provides an interactive terminal logging experience with spinners based on the Ora package.
It's useful for displaying loading states, progress indicators, and completion states in the terminal.

### Basic Usage

```typescript
import { StreamLogger } from '@shermant/logger'

// Create a new StreamLogger instance with optional prefix text
const streamLogger = new StreamLogger('loading', ['cyan'])

// Set main text and styles
streamLogger.text('Processing data', ['bold'])

// Set detail text (displayed on a new line)
streamLogger.detail('File: data.json', ['dim'])

// Update the spinner to apply changes
await streamLogger.update()

// After some operation completes, update state
streamLogger.state('succeed').text('Data processed successfully')
await streamLogger.update()
```

### Constructor

```typescript
new StreamLogger(prefix ? : string, prefixStyles ? : Type.Styles)
```

Creates a new StreamLogger instance with an optional prefix text and styles. The spinner starts automatically upon
creation.

### Methods

#### `text(text: string, styles?: Type.Styles)`

Sets the main text of the spinner. The text will be displayed after capitalization and styling.

```typescript
streamLogger.text('Loading resources', ['bold', 'blue'])
```

#### `detail(detail: string, styles?: Type.Styles)`

Sets the detail text that will be displayed on a new line below the main text.

```typescript
streamLogger.detail('Processing file 1 of 10', ['dim'])
```

#### `delay(delay: number)`

Sets a delay (in milliseconds) before the spinner updates to its next state.

```typescript
streamLogger.delay(2000)
```

#### `state(state: 'start' | 'stop' | 'succeed' | 'fail')`

Sets the spinner's state. The actual state change will occur when `update()` or `asyncUpdate()` is called.

```typescript
streamLogger.state('succeed')
```

#### `update(): void`

Updates the spinner with the current configuration. This method must be called after changing any settings to apply them.

```typescript
streamLogger.update()
```

#### `asyncUpdate(delay?: number): Promise<void>`

Asynchronously updates the spinner with the current configuration and waits for the specified delay. If a delay was previously set using the `delay()` method, that value will be used and then reset to 0.

```typescript
await streamLogger.asyncUpdate()
// or with a specific delay
await streamLogger.asyncUpdate(1000)
```

### Example Use Cases

#### File Processing

```typescript
import { StreamLogger } from '@shermant/logger'

async function processFiles(files: string[]) {
  const streamLogger = new StreamLogger('Processing', ['cyan'])

  for (let i = 0; i < files.length; i++) {
    streamLogger.text(`Processing file ${i + 1}/${files.length}`)
    streamLogger.detail(files[i], ['dim'])
    await streamLogger.asyncUpdate()

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  streamLogger.state('succeed').text('All files processed')
  await streamLogger.asyncUpdate()
}
```

#### API Request

```typescript
import { StreamLogger } from '@shermant/logger'

async function fetchData(url: string) {
  const streamLogger = new StreamLogger('API', ['magenta'])

  try {
    streamLogger.text('Sending request')
    streamLogger.detail(url, ['dim'])
    await streamLogger.asyncUpdate()

    // Simulate API call
    const response = await fetch(url)

    if (response.ok) {
      streamLogger.state('succeed').text('Data retrieved successfully')
      streamLogger.update()
    }
    else {
      streamLogger.state('fail').text(`Error: ${response.status}`)
      streamLogger.update()
    }

    return response
  }
  catch (error) {
    streamLogger.state('fail').text(`Request failed: ${error.message}`)
    streamLogger.update()
    throw error
  }
}
