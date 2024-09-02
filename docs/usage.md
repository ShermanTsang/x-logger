# API & Usage

The basic usage involves using the logger `accessor`(function-based proxy) to print messages.

Predefined log types are wrapped in static getters,
allowing direct use.

## `Logger.[TypeName]` static getter

The basic usage of this package is to use the `logger` accessor to log messages.

This package wraps preset log types in static getters, and you can use them directly.

Each of them will return a `Logger` instance with the corresponding log type, you can continue to use chain calling .

```typescript
import {logger} from '@shermant/logger';

logger.info.tag('info title').message('This is an info message').print();
logger.warn.tag('warn title').message('This is a warning message').print();
logger.error.tag('error title').message('This is an error message').print();
logger.debug.tag('debug title').message('This is a debug message').print();
logger.success.tag('success title').message('This is a success message').print();
logger.failure.tag('failure title').message('This is a failure message').print();
logger.plain.tag('plain title').message('This is a plain message').print();
```

## `Logger` class

All functions are provided by the `Logger` class.

When you invoke `Logger` class and chain call `type` function, you have no need to create an instance of the `Logger`
class white `new` EcmaScript syntax.

```typescript
import {Logger} from '@shermant/logger';

// You can use `Logger` instances sharing the same log type and other config options in this way.
const logger = Logger.type('info').time().prependDivider('♥');
logger.tag('love').message('the world').print();
logger.tag('love').message('you').print();
```

## `logger` accessor

You are recommend to use the `logger` accessor to use the `Logger` class.

With the `logger` accessor, you can use the `Logger` class without creating an instance.

```typescript
import {logger} from '@shermant/logger';
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
    .tag('custom logger')
    .message('test adding custom logger type via type function')
    .print()
```

Next time, use `newType` with the `type` function.

```typescript
logger
    .type('newType')
    .tag('custom logger')
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
    .tag('custom logger')
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
logger.type('anyType').tag('type').message('This is an info message').print();
```

### Override Preset Style

You can override the preset style by using the `style` method. The `style` method takes an array of two strings: the
background color and the text color.

```typescript

import {logger} from '@shermant/logger';

logger.type('info', ['bgRed', 'white']).tag('info title').message('This is a red info message').print();
```

### Add custom log types

When you use the `type` method to create a new log type, you need to pass two arguments: the type `name` and
the `style`.

```typescript
import {logger} from '@shermant/logger';

// The instance will automatically register a type named `myCustomType`
logger.type('myCustomType', ['bgRed', 'white'])

// Then, you can use `myCustomType` to log messages
logger.type('myCustomType').tag('custom').message('This is a custom message').print();
```

## `tag()` method

Use `tag(string)` to add a tag to the log message, and the tag will be displayed in the log message.

In the future, you can use `tag` attribute to filter log messages.

## `message()` method

Use `message(string)` to add a message to the log message.

### Emphasize key information

With `[[key infomation]]}` syntax, you can emphasize key information in the log message.

```typescript
import {logger} from '@shermant/logger';

logger.info.tag('info title').message('This is an info message with [[key information]]').print();
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
import {logger} from '@shermant/logger';

logger.info.tag('info title').prependDivider().message('This is an info message').print();
logger.info.tag('info title').appendDivider().message('This is an info message').print();
```

## `time()` method

If you want to display the log time, you can use the `time()` method.

```typescript
import {logger} from '@shermant/logger';

logger.info.tag('info title').time().message('This is an info message').print();
```

## `styles()` method

Use `styles()` to add styles to the log message.

Note that the styles will only be applied to the log message without the tag part.

```typescript
import {logger} from '@shermant/logger';

logger.info.tag('info title').styles(['bgRed', 'white']).message('This is an info message').print();
```

## `data()` method

Use `data()` method to print your data below the log message.

The second parameter is a boolean value that controls whether to print the data in the log message, default value is
`true`.

```typescript
logger.info.tag('info title').styles(['bgRed', 'white']).message('error data')
    .data(
        {
            error: 'error message',
            status: 500
        },
        false
    ).print();
```
