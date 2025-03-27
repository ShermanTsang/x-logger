# Introduction

`Logger` is a lightweight logging library that allows custom log styles and tags. It provides some predefined log types
and supports the dynamic creation of new log types.

![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/ShermanTsang/Logger-TypeScript?label=version)

![Build Status](https://github.com/ShermanTsang/Logger-TypeScript/actions/workflows/npm-publish.yml/badge.svg)

![npm](https://img.shields.io/npm/dt/@shermant/logger)

## Features

- Multiple predefined log types (info, warn, error, debug, success, failure, plain)
- Custom log type styles
- Log tags
- Log prepend and append dividers
- Displaying log time
- Dynamic creation of custom log types
- Interactive spinner-based logging with `StreamLogger`

## Installation

Install using any package manager: npm, pnpm, yarn, or bun:

```bash
bun add @shermant/logger
npm install @shermant/logger
pnpm install @shermant/logger
yarn add @shermant/logger
```

## Concept

The following concepts are used in this package

### Log Type

This lib provides seven predefined log types: `info`, `warn`, `error`, `debug`, `success`, `failure`, and `plain`.

You can use them directly to log messages, and every log type has a corresponding style.

### Style

This package uses the chalk package to style log messages. Any style provided by chalk can be used to customize log
text styles. Use the style method to customize the log text style. The style method takes an array of two strings:
the background color and the text color.

Therefore, you can use the `style` method to customize the log text style. The `style` method takes an array of two
strings: the background color and the text color.

Below is the type definition of the `Style` type

```typescript
import {ChalkInstance} from 'chalk'

namespace LoggerType {
    // ignored content...
    type Style = keyof ChalkInstance
    type Styles = Style[]
    // ignored content...
}
```

### StreamLogger

The `StreamLogger` class provides interactive terminal logging with spinners. It's built on top of the Ora package and
allows you to display loading states, success/failure indicators, and detailed progress messages in the terminal.

Key features of `StreamLogger`:

- Interactive spinners for indicating in-progress operations
- Support for multiple states: start, stop, succeed, fail
- Custom styling for text, details, and prefix elements
- Ability to set delays between state changes
- Chainable API for fluent configuration
