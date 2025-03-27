# API & Usage

The basic usage involves using the logger `accessor`(function-based proxy) to print messages.

Predefined log types are wrapped in static getters,
allowing direct use.

## `Logger.[TypeName]` static getter

The basic usage of this package is to use the `logger` accessor to log messages.

This package wraps preset log types in static getters, and you can use them directly.

Each of them will return a `Logger` instance with the corresponding log type, you can continue to use chain calling .

```typescript
import {logger} from '@shermant/logger'

logger.info.prefix('info title').message('This is an info message').print()
logger.warn.prefix('warn title').message('This is a warning message').print()
logger.error.prefix('error title').message('This is an error message').print()
logger.debug.prefix('debug title').message('This is a debug message').print()
logger.success.prefix('success title').message('This is a success message').print()
logger.failure.prefix('failure title').message('This is a failure message').print()
logger.plain.prefix('plain title').message('This is a plain message').print()
```

## `Logger` class

All functions are provided by the `Logger` class.

When you invoke `Logger` class and chain call `type` function, you have no need to create an instance of the `Logger`
class white `new` EcmaScript syntax.

```typescript
import {Logger} from '@shermant/logger'

// You can use `Logger` instances sharing the same log type and other config options in this way.
const logger = Logger.type('info').time().prependDivider('♥')
logger.prefix('love').message('the world').print()
logger.prefix('love').message('you').print()
```

## `logger` accessor

You are recommend to use the `logger` accessor to use the `Logger` class.

With the `logger` accessor, you can use the `Logger` class without creating an instance.

```typescript
import {logger} from '@shermant/logger'
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
    .message('test adding custom logger type via type function')
    .print()
```

Next time, use `newType` with the `type` function.

```typescript
logger
    .type('newType')
    .prefix('custom logger')
    .message('The next time you can use `newType` with `type` function')
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
    .message('Also, you can use `newType` directly, but not recommend')
    .print()
```

## `print()` method

Use print() to output the log message to the console. You can pass a boolean value to control whether the log message is
output.

## `type()` method

`type` is a static function that allows you to create a new log type.

### Specify log type

Use `type(string, [styles])` to specify the log type, or you can create custom log type.

```typescript
// You can use the `type` method to specify the log type
logger.type('anyType').prefix('type').message('This is an info message').print()
```

### Override Preset Style

You can override the preset style by using the `style` method. The `style` method takes an array of two strings: the
background color and the text color.

```typescript
import {logger} from '@shermant/logger'

logger.type('info', ['bgRed', 'white']).prefix('info title').message('This is a red info message').print()
```

### Add custom log types

When you use the `type` method to create a new log type, you need to pass two arguments: the type `name` and
the `style`.

```typescript
import {logger} from '@shermant/logger'

// The instance will automatically register a type named `myCustomType`
logger.type('myCustomType', ['bgRed', 'white'])

// Then, you can use `myCustomType` to log messages
logger.type('myCustomType').prefix('custom').message('This is a custom message').print()
```

## `prefix()` method

Use `prefix(string)` to add a prefix to the log message, and the prefix will be displayed in the log message.

In the future, you can use `prefix` attribute to filter log messages.

## `message()` method

Use `message(string)` to add a message to the log message.

### Emphasize key information

With `[[key infomation]]}` syntax, you can emphasize key information in the log message.

```typescript
import {logger} from '@shermant/logger'

logger.info.prefix('info title').message('This is an info message with [[key information]]').print()
```

Then, the message `formatter` will use `chalk.yellow.underline` style to decorate the key information.

Later, you are able to customize the style and the matched sign of the key information.

## `prependDivider()` & `appendDivider()` method

Use `prependDivider()` to add a divider before the log message.

Use `appendDivider()` to add a divider after the log message.

Both of them receive three optional arguments: `char`, `length`, and `styles`.

The default value of `char` is `-`, the default value of `length` is `80`, and the default value of `styles` is
`['bgWhite', 'black']`.

```typescript
import {logger} from '@shermant/logger'

logger.info.prefix('info title').prependDivider().message('This is an info message').print()
logger.info.prefix('info title').appendDivider().message('This is an info message').print()
```

## `time()` method

If you want to display the log time, you can use the `time()` method.

```typescript
import {logger} from '@shermant/logger'

logger.info.prefix('info title').time().message('This is an info message').print()
```

## `styles()` method

Use `styles()` to add styles to the log message.

Note that the styles will only be applied to the log message without the prefix part.

```typescript
import {logger} from '@shermant/logger'

logger.info.prefix('info title').styles(['bgRed', 'white']).message('This is an info message').print()
```

## `data()` method

Use `data()` method to print your data below the log message.

The second parameter is a boolean value that controls whether to print the data in the log message, default value is
`true`.

```typescript
logger.info.prefix('info title').styles(['bgRed', 'white']).message('error data')
    .data(
        {
            error: 'error message',
            status: 500
        },
        false
    ).print()
```

## `toString()` method

Use `toString()` method to get the formatted and rendered log message.

```typescript
import {logger} from '@shermant/logger'

logger('This is an info [[message]]').toString()
```

## `StreamLogger` class

The `StreamLogger` class provides an interactive terminal logging experience with spinners based on the Ora package.
It's useful for displaying loading states, progress indicators, and completion states in the terminal.

### Basic Usage

```typescript
import {StreamLogger} from '@shermant/logger'

// Create a new StreamLogger instance with optional prefix text
const streamLogger = new StreamLogger('loading', ['cyan'])

// Set main text and styles
streamLogger.setText('Processing data', ['bold'])

// Set detail text (displayed on a new line)
streamLogger.setDetail('File: data.json', ['dim'])

// Update the spinner to apply changes
await streamLogger.update()

// After some operation completes, update state
streamLogger.setState('succeed').setText('Data processed successfully')
await streamLogger.update()
```

### Constructor

```typescript
new StreamLogger(prefixText ? : string, prefixTextStyles ? : Type.Styles)
```

Creates a new StreamLogger instance with an optional prefix text and styles. The spinner starts automatically upon
creation.

### Methods

#### `setText(text: string, styles?: Type.Styles)`

Sets the main text of the spinner. The text will be displayed after capitalization and styling.

```typescript
streamLogger.setText('Loading resources', ['bold', 'blue'])
```

#### `setDetail(detail: string, styles?: Type.Styles)`

Sets the detail text that will be displayed on a new line below the main text.

```typescript
streamLogger.setDetail('Processing file 1 of 10', ['dim'])
```

#### `setDelay(delay: number)`

Sets a delay (in milliseconds) before the spinner updates to its next state.

```typescript
streamLogger.setDelay(2000)
```

#### `setState(state: 'start' | 'stop' | 'succeed' | 'fail')`

Sets the spinner's state. The actual state change will occur when `update()` is called.

```typescript
streamLogger.setState('succeed')
```

#### `update(): Promise<void>`

Updates the spinner with the current configuration. This method must be called after changing any settings to apply
them.

```typescript
await streamLogger.update()
```

#### `succeed(text?: string)`

Immediately displays a success indicator and stops the spinner. The optional text parameter will override the current
text.

```typescript
streamLogger.succeed('Operation completed successfully')
```

#### `fail(text?: string)`

Immediately displays a failure indicator and stops the spinner. The optional text parameter will override the current
text.

```typescript
streamLogger.fail('Operation failed')
```

### Example Use Cases

#### File Processing

```typescript
import {StreamLogger} from '@shermant/logger'

async function processFiles(files: string[]) {
    const streamLogger = new StreamLogger('Processing', ['cyan'])

    for (let i = 0; i < files.length; i++) {
        streamLogger.setText(`Processing file ${i + 1}/${files.length}`)
        streamLogger.setDetail(files[i], ['dim'])
        await streamLogger.update()

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    streamLogger.setState('succeed').setText('All files processed')
    await streamLogger.update()
}
```

#### API Request

```typescript
import { StreamLogger } from '@shermant/logger'

async function fetchData(url: string) {
  const streamLogger = new StreamLogger('API', ['magenta'])

  try {
    streamLogger.setText('Sending request')
    streamLogger.setDetail(url, ['dim'])
    await streamLogger.update()

    // Simulate API call
    const response = await fetch(url)

    if (response.ok) {
      streamLogger.succeed('Data retrieved successfully')
    }
    else {
      streamLogger.fail(`Error: ${response.status}`)
    }

    return response
  }
  catch (error) {
    streamLogger.fail(`Request failed: ${error.message}`)
    throw error
  }
}
