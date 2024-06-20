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

## Installation

Install using any package manager: npm, pnpm, yarn, or bun:

```bash
npm install @shermant/logger
pnpm install @shermant/logger
yarn add @shermant/logger
bun add @shermant/logger
```

## Concept

The following concepts are used in this package

### Log Type

This lib provides seven predefined log types: `info`, `warn`, `error`, `debug`, `success`, `failure`, and `plain`.

You can use them directly to log messages, and every log type has a corresponding style.

### Style

This package uses the chalk package to style log messages. Any style provided by chalk can be used to customize log
message styles. Use the style method to customize the log message style. The style method takes an array of two strings:
the background color and the text color.

Therefore, you can use the `style` method to customize the log message style. The `style` method takes an array of two
strings: the background color and the text color.

Below is the type definition of the `Style` type

```typescript
import {ChalkInstance} from "chalk";

namespace LoggerType {
    // ignored content...
    type Style = keyof ChalkInstance;
    type Styles = Style[]
    // ignored content...
}
```
