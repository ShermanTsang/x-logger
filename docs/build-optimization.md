# Build Optimization: Excluding Chalk

This guide covers various strategies to exclude `chalk` from your builds when using `@shermant/logger`, particularly useful for browser environments, serverless functions, or when you want to minimize bundle size.

## Overview

The `@shermant/logger` library is designed to work with or without `chalk`. When `chalk` is not available, the logger gracefully falls back to plain text output or browser-compatible CSS styling.

## Quick Start

**Download ready-to-use configuration files:**
- 📁 [Complete Vite Configuration Example](/x-logger/vite.config.example.js)
- 📁 [Chalk Stub for Browser Builds](/x-logger/chalk-stub.js)

**Basic Vite setup to exclude chalk:**

```bash
# 1. Install Vite
npm install --save-dev vite

# 2. Download our example config
curl -o vite.config.js https://shermant.github.io/x-logger/vite.config.example.js

# 3. Build for different targets
npm run build:browser  # Excludes chalk
npm run build:node     # Includes chalk
```

## Current Project Setup

The Sherman Logger project already implements several optimization strategies:

### 1. Optional Dependencies

In `package.json`, `chalk` is listed as an optional dependency:

```json
{
  "optionalDependencies": {
    "chalk": "^5.3.0",
    "ora": "^8.2.0"
  }
}
```

This means:
- ✅ `chalk` won't be installed if it fails
- ✅ Your application won't break if `chalk` is missing
- ✅ Package managers can skip optional dependencies

### 2. Build-time Externalization

The build scripts already exclude `chalk` from bundles:

```json
{
  "scripts": {
    "build:node": "bun build ./src/index.ts --minify --outdir ./.output/dist --target node --external chalk --external ora",
    "build:browser": "bun build ./src/index.ts --minify --outfile ./.output/dist/index.browser.js --target browser --external chalk --external ora --external node:module --external node:process --external node:fs --external node:path --external node:os --define process.env.NODE_ENV='\"browser\"' --define process='undefined'"
  }
}
```

### 3. Runtime Detection and Graceful Fallback

The library includes runtime detection in <mcfile name="adapter.ts" path="src/adapter.ts"></mcfile>:

```typescript
// Lazy-loaded chalk for Node.js environments
let chalkInstance: any = null

async function getChalk() {
  if (!chalkInstance && isNode && !isBrowser) {
    try {
      const chalkModule = await import('chalk')
      chalkInstance = chalkModule.default
    }
    catch (error) {
      // Silently fail in browser environments or when chalk is not available
      if (isNode) {
        safeConsoleLog('Failed to load chalk:', error)
      }
    }
  }
  return chalkInstance
}
```

## Vite Configuration Strategies

### 1. Basic Vite External Configuration

Create or update your `vite.config.js`:

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['chalk', 'ora']
    }
  }
})
```

### 2. Conditional Externalization

For more control, you can conditionally exclude chalk based on build target:

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  const isBrowser = process.env.TARGET === 'browser'
  
  return {
    build: {
      rollupOptions: {
        external: isBrowser ? ['chalk', 'ora'] : []
      }
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.TARGET': JSON.stringify(process.env.TARGET || 'node')
    }
  }
})
```

### 3. Advanced Vite Configuration with Aliases

Replace chalk with a lightweight alternative or stub:

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      // Replace chalk with a lightweight stub for browser builds
      'chalk': path.resolve(__dirname, 'src/stubs/chalk-stub.js')
    }
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Exclude chalk and ora for browser builds
        if (process.env.TARGET === 'browser') {
          return ['chalk', 'ora'].includes(id)
        }
        return false
      }
    }
  }
})
```

Create a chalk stub file (you can download our [example chalk stub](/x-logger/chalk-stub.js)):

```javascript
// src/stubs/chalk-stub.js
export default new Proxy({}, {
  get() {
    return (text) => text // Return text as-is
  }
})
```

## Webpack Configuration

### 1. Basic Webpack Externals

```javascript
// webpack.config.js
module.exports = {
  externals: {
    'chalk': 'chalk',
    'ora': 'ora'
  }
}
```

### 2. Conditional Webpack Externals

```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isBrowser = env.target === 'browser'
  
  return {
    externals: isBrowser ? {
      'chalk': 'chalk',
      'ora': 'ora'
    } : {},
    resolve: {
      fallback: isBrowser ? {
        'chalk': false,
        'ora': false
      } : {}
    }
  }
}
```

## Rollup Configuration

### 1. Basic Rollup Externals

```javascript
// rollup.config.js
export default {
  external: ['chalk', 'ora'],
  output: {
    globals: {
      'chalk': 'chalk',
      'ora': 'ora'
    }
  }
}
```

### 2. Conditional Rollup Configuration

```javascript
// rollup.config.js
import { defineConfig } from 'rollup'

export default defineConfig((commandLineArgs) => {
  const isBrowser = commandLineArgs.configTarget === 'browser'
  
  return {
    external: isBrowser ? ['chalk', 'ora'] : [],
    plugins: [
      // Add plugins based on target
    ]
  }
})
```

## Environment-Specific Strategies

### 1. Browser Builds

For browser environments, always exclude chalk:

```javascript
// Browser-specific build configuration
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ShermanLogger',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['chalk', 'ora'],
      output: {
        globals: {
          'chalk': 'chalk',
          'ora': 'ora'
        }
      }
    }
  }
})
```

### 2. Serverless Functions

For serverless environments where bundle size matters:

```javascript
// Serverless-optimized configuration
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['chalk', 'ora'],
      output: {
        manualChunks: undefined // Prevent code splitting
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true // Remove console.log in production
      }
    }
  }
})
```

### 3. Node.js Applications

For Node.js apps where you want to include chalk:

```javascript
// Node.js-specific configuration
export default defineConfig({
  build: {
    target: 'node',
    rollupOptions: {
      // Don't externalize chalk for Node.js builds
      external: (id) => {
        return !['chalk', 'ora'].includes(id) && /^[^.]/.test(id)
      }
    }
  }
})
```

## Package.json Scripts

You can create different build scripts for different targets:

```json
{
  "scripts": {
    "build": "npm run build:node && npm run build:browser",
    "build:node": "vite build --mode production",
    "build:browser": "TARGET=browser vite build --mode production",
    "build:serverless": "TARGET=serverless vite build --mode production"
  }
}
```

## Runtime Environment Detection

The Sherman Logger already includes sophisticated environment detection:

```typescript
// Environment detection
export const isBrowser = typeof globalThis !== 'undefined'
  && typeof (globalThis as any).window !== 'undefined'
  && typeof (globalThis as any).document !== 'undefined'

export const isNode = typeof globalThis !== 'undefined'
  && typeof (globalThis as any).process !== 'undefined'
  && (globalThis as any).process?.versions?.node
  && !isBrowser
```

This ensures that:
- ✅ Chalk is only loaded in Node.js environments
- ✅ Browser environments use CSS styling instead
- ✅ No runtime errors occur when chalk is missing

## Testing Without Chalk

To test your application without chalk:

```bash
# Install without optional dependencies
npm install --no-optional

# Or remove chalk temporarily
npm uninstall chalk

# Run your tests
npm test
```

## Best Practices

### 1. Always Use Optional Dependencies

```json
{
  "optionalDependencies": {
    "chalk": "^5.3.0"
  }
}
```

### 2. Implement Graceful Fallbacks

```typescript
// Good: Graceful fallback
const styledText = chalk ? chalk.red(text) : text

// Better: Use the library's built-in fallbacks
logger.error.text(text).print()
```

### 3. Environment-Specific Builds

Create separate builds for different environments:

```bash
# Browser build (excludes chalk)
npm run build:browser

# Node.js build (includes chalk)
npm run build:node

# Serverless build (minimal bundle)
npm run build:serverless
```

### 4. Bundle Analysis

Analyze your bundles to ensure chalk is properly excluded:

```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze your bundle
npx webpack-bundle-analyzer dist/main.js
```

## Troubleshooting

### Common Issues

1. **Chalk still in bundle**: Check your external configuration
2. **Runtime errors**: Ensure graceful fallbacks are implemented
3. **Missing colors**: Verify environment detection logic
4. **Large bundle size**: Use bundle analyzer to identify issues

### Debug Commands

```bash
# Check if chalk is installed
npm list chalk

# Verify bundle contents
npx webpack-bundle-analyzer dist/

# Test without chalk
npm uninstall chalk && npm test
```

## Conclusion

The Sherman Logger is designed to work seamlessly with or without chalk. By using the strategies outlined in this guide, you can:

- ✅ Reduce bundle size for browser applications
- ✅ Optimize serverless function deployments
- ✅ Maintain functionality across all environments
- ✅ Implement graceful fallbacks for missing dependencies

The library's built-in environment detection and fallback mechanisms ensure that your logging will work regardless of whether chalk is available in your target environment.