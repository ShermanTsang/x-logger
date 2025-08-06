# Getting Started

Welcome to `@shermant/logger` - a modern, lightweight, and feature-rich logging library for TypeScript and JavaScript applications.

![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/ShermanTsang/Logger-TypeScript?label=version)
![Build Status](https://github.com/ShermanTsang/Logger-TypeScript/actions/workflows/npm-publish.yml/badge.svg)
![npm](https://img.shields.io/npm/dt/@shermant/logger)

## Features

✨ **Core Features**
- 🎯 **Predefined Log Types**: info, warn, error, debug, success, failure, plain
- 🎨 **Rich Styling**: Full Chalk.js integration for colors and text decoration
- 🔗 **Chainable API**: Fluent interface for building complex log messages
- ⚡ **Zero Dependencies**: Core functionality requires no external dependencies
- 🌐 **Cross-Platform**: Works in Node.js, Bun, and browser environments

🚀 **Advanced Features**
- 🎯 **Custom Log Types**: Create and register your own log types dynamically
- 📊 **Stream Logging**: Interactive spinners and progress indicators
- ⏰ **Timestamps**: Built-in time display with customizable formatting
- 🎭 **Dividers**: Visual separators for better log organization
- 🔧 **TypeScript**: Full type safety with excellent IntelliSense support

## Installation

Install using your preferred package manager:

::: code-group

```bash [bun]
bun add @shermant/logger
```

```bash [npm]
npm install @shermant/logger
```

```bash [yarn]
yarn add @shermant/logger
```

```bash [pnpm]
pnpm add @shermant/logger
```

:::

## Quick Start

### Basic Usage

```typescript
import { logger } from '@shermant/logger'

// Simple logging with predefined types
logger.info.text('Application started').print()
logger.warn.text('This is a warning').print()
logger.error.text('Something went wrong').print()
logger.success.text('Operation completed').print()
```

### Chainable API

```typescript
import { logger } from '@shermant/logger'

// Build complex log messages
logger
  .info
  .prefix('🚀 APP')
  .text('Server starting on port 3000')
  .detail('Environment: development')
  .time()
  .print()
```

### Browser Compatibility

The logger automatically detects the environment and adapts its behavior:

```typescript
// Works in both Node.js and browser
import { logger } from '@shermant/logger'

logger.info.text('This works everywhere!').print()
```

## Environment Support

| Environment | Status | Notes |
|-------------|--------|-------|
| Node.js     | ✅ Full | All features available |
| Bun         | ✅ Full | Optimized for Bun runtime |
| Browser     | ✅ Partial | Colors may not display in all consoles |
| Deno        | ✅ Compatible | Works with ES modules |

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
import { ChalkInstance } from 'chalk'

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
