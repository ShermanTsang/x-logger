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

logger.info.prefix('info title').text('This is an info text').print()
logger.warn.prefix('warn title').text('This is a warning text').print()
logger.error.prefix('error title').text('This is an error text').print()
logger.debug.prefix('debug title').text('This is a debug text').print()
logger.success.prefix('success title').text('This is a success text').print()
logger.failure.prefix('failure title').text('This is a failure text').print()
logger.plain.prefix('plain title').text('This is a plain text').print()
```

## `Logger` class

All functions are provided by the `Logger` class.

When you invoke `Logger` class and chain call `type` function, you have no need to create an instance of the `Logger`
class white `new` EcmaScript syntax.

```typescript
import {Logger} from '@shermant/logger'

// You can use `Logger` instances sharing the same log type and other config options in this way.
const logger = Logger.type('info').time().prependDivider('♥')
logger.prefix('love').text('the world').print()
logger.prefix('love').text('you').print()
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
import {logger} from '@shermant/logger'

logger.type('info', ['bgRed', 'white']).prefix('info title').text('This is a red info text').print()
```

### Add custom log types

When you use the `type` method to create a new log type, you need to pass two arguments: the type `name` and
the `style`.

```typescript
import {logger} from '@shermant/logger'

// The instance will automatically register a type named `myCustomType`
logger.type('myCustomType', ['bgRed', 'white'])

// Then, you can use `myCustomType` to log messages
logger.type('myCustomType').prefix('custom').text('This is a custom text').print()
```

## `prefix()` method

Use `prefix(string)` to add a prefix to the log text, and the prefix will be displayed in the log text.

In the future, you can use `prefix` attribute to filter log messages.

## `text()` method

Use `text(string)` to add a text to the log text.

### Emphasize key information

With `[[key infomation]]}` syntax, you can emphasize key information in the log text.

```typescript
import {logger} from '@shermant/logger'

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
import {logger} from '@shermant/logger'

logger.info.prefix('info title').prependDivider().text('This is an info text').print()
logger.info.prefix('info title').appendDivider().text('This is an info text').print()
```

## `time()` method

If you want to display the log time, you can use the `time()` method.

```typescript
import {logger} from '@shermant/logger'

logger.info.prefix('info title').time().text('This is an info text').print()
```

## `styles()` method

Use `styles()` to add styles to the log text.

Note that the styles will only be applied to the log text without the prefix part.

```typescript
import {logger} from '@shermant/logger'

logger.info.prefix('info title').styles(['bgRed', 'white']).text('This is an info text').print()
```

## `detail()` method

Use `detail()` to add a detail to the log text.

```typescript
import {logger} from '@shermant/logger'

logger.info.prefix('info title').detail('This is a detail').text('This is an info text').print()
```

The detail will be displayed below the main log text.

## `data()` method

Use `data()` method to print your data below the log text.

The second parameter is a boolean value that controls whether to print the data in the log text, default value is
`true`.

```typescript
logger.info.prefix('info title').styles(['bgRed', 'white']).text('error data')
    .data(
        {
            error: 'error text',
            status: 500
        },
        false
    ).print()
```

## `toString()` method

Use `toString()` method to get the formatted and rendered log text.

```typescript
import {logger} from '@shermant/logger'

logger('This is an info [[text]]').toString()
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

Sets the spinner's state. The actual state change will occur when `update()` is called.

```typescript
streamLogger.state('succeed')
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
        streamLogger.text(`Processing file ${i + 1}/${files.length}`)
        streamLogger.detail(files[i], ['dim'])
        await streamLogger.update()

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    streamLogger.state('succeed').text('All files processed')
    await streamLogger.update()
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
    streamLogger.fail(`Request failed: ${error.text}`)
    throw error
  }
}
