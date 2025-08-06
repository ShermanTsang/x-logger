---
layout: home

hero:
  name: "@shermant/logger"
  text: "Lightweight Multi-platform Logger"

  tagline: A graceful, chainable, and cross-platform logging solution for modern JavaScript applications
  image:
    src: /logo.svg
    alt: Sherman Logger
  actions:
    - theme: brand
      text: Get Started
      link: /basic
    - theme: alt
      text: View on GitHub
      link: https://github.com/ShermanTsang/Logger-TypeScript

features:
  - icon: 🔗
    title: Chainable API
    details: Fluent interface design allows for elegant method chaining to build complex log messages with ease.

  - icon: 🎨
    title: Rich Styling
    details: Built-in support for colors, backgrounds, and text decorations using Chalk.js styling system.

  - icon: 🌐
    title: Cross-Platform
    details: Works seamlessly in Node.js, Bun, and browser environments with automatic feature detection.

  - icon: ⚡
    title: Zero Dependencies
    details: Core functionality has no required dependencies. Optional enhancements available with chalk and ora.

  - icon: 🔧
    title: TypeScript First
    details: Written in TypeScript with full type safety and excellent IntelliSense support.

  - icon: 📦
    title: Lightweight
    details: Minimal bundle size with tree-shaking support for optimal performance in any environment.

  - icon: 🎯
    title: Custom Types
    details: Easily create and register custom logger types with your own styling and behavior.

  - icon: 📊
    title: Stream Support
    details: Built-in streaming logger for real-time updates and progress indicators.
---

## Quick Example

```typescript
import { logger } from '@shermant/logger'

// Simple logging
logger.info.text('Application started').print()

// Chainable with styling
logger.success
  .prefix('✅ SUCCESS')
  .text('Database connected successfully')
  .detail('Connection established in 150ms')
  .print()

// Custom types
logger
  .type('custom', ['bgMagenta', 'bold'])
  .prefix('CUSTOM')
  .text('This is a custom log type')
  .print()

// Stream logging for progress
const stream = logger.stream
stream.prefix('📦 Installing').text('packages...').update()
```

## Installation

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

## Why Choose Sherman Logger?

- **Developer Experience**: Intuitive API that feels natural to use
- **Performance**: Optimized for both development and production environments
- **Flexibility**: Extensible design allows for custom logging patterns
- **Reliability**: Comprehensive test suite ensures consistent behavior
- **Modern**: Built with modern JavaScript/TypeScript best practices
