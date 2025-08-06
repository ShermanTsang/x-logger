# Browser Support

`@shermant/logger` is designed to work seamlessly across different environments, including modern web browsers. This guide covers browser-specific features, limitations, and best practices for using the logger in client-side applications.

Use test webpage to test browser support.
Link: [Browser Test](https://shermantsang.github.io/x-logger/browser-test.html)

## Browser Compatibility

### Supported Browsers

| Browser       | Version | Support Level | Notes                   |
| ------------- | ------- | ------------- | ----------------------- |
| Chrome        | 80+     | ✅ Full       | All features supported  |
| Firefox       | 75+     | ✅ Full       | All features supported  |
| Safari        | 13+     | ✅ Full       | All features supported  |
| Edge          | 80+     | ✅ Full       | All features supported  |
| Opera         | 67+     | ✅ Full       | All features supported  |
| Mobile Safari | 13+     | ✅ Partial    | Limited console styling |
| Chrome Mobile | 80+     | ✅ Partial    | Limited console styling |

### Feature Support Matrix

| Feature         | Desktop Browsers | Mobile Browsers | Notes                               |
| --------------- | ---------------- | --------------- | ----------------------------------- |
| Basic Logging   | ✅ Full          | ✅ Full         | Always available                    |
| Console Styling | ✅ Full          | ⚠️ Limited      | Mobile consoles may not show colors |
| Highlights      | ✅ Full          | ✅ Full         | Works with CSS styling              |
| Stream Logging  | ✅ Full          | ✅ Full         | Full functionality                  |
| Time Stamps     | ✅ Full          | ✅ Full         | Native browser support              |
| Dividers        | ✅ Full          | ✅ Full         | Text-based dividers                 |

## Installation for Browser

### ES Modules (Recommended)

```html
<!doctype html>
<html>
  <head>
    <title>Sherman Logger Browser Example</title>
  </head>
  <body>
    <script type="module">
      import { logger } from "./node_modules/@shermant/logger/dist/index.js";

      logger.info.text("Hello from browser!").print();
    </script>
  </body>
</html>
```

### CDN Usage

```html
<!doctype html>
<html>
  <head>
    <title>Sherman Logger CDN Example</title>
  </head>
  <body>
    <script type="module">
      import { logger } from "https://unpkg.com/@shermant/logger@latest/dist/index.js";

      logger.success.text("Loaded from CDN!").print();
    </script>
  </body>
</html>
```

### Bundle Integration

```javascript
// webpack.config.js
module.exports = {
  // ... other config
  resolve: {
    alias: {
      '@shermant/logger': path.resolve(
        __dirname,
        'node_modules/@shermant/logger/dist/index.js'
      ),
    },
  },
}
```

## Browser-Specific Features

### Console Styling

Browsers support CSS-based console styling, which the logger automatically detects and uses:

```typescript
import { logger } from '@shermant/logger'

// These will appear with colors and styling in browser console
logger.info.text('Blue background info message').print()
logger.success.text('Green background success message').print()
logger.error.text('Red background error message').print()
logger.warn.text('Yellow background warning message').print()
```

### Environment Detection

The logger automatically detects browser environment and adapts its behavior:

```typescript
import { logger } from '@shermant/logger'

// The logger automatically detects it's running in a browser
logger.info
  .prefix('🌐 BROWSER')
  .text('Running in browser environment')
  .detail(`User Agent: ${navigator.userAgent}`)
  .detail(`URL: ${window.location.href}`)
  .print()
```

### Browser-Specific Logging

```typescript
import { logger } from '@shermant/logger'

// Page lifecycle logging
window.addEventListener('DOMContentLoaded', () => {
  logger.success.prefix('📄 PAGE').text('DOM content loaded').time().print()
})

window.addEventListener('load', () => {
  logger.success
    .prefix('📄 PAGE')
    .text('Page fully loaded')
    .detail('All resources loaded')
    .time()
    .print()
})

// User interaction logging
document.addEventListener('click', (event) => {
  logger.info
    .prefix('👆 CLICK')
    .text('User interaction detected')
    .detail(`Element: ${event.target.tagName}`)
    .detail(`Position: ${event.clientX}, ${event.clientY}`)
    .print()
})
```

## Interactive Browser Demo

You can test the logger directly in your browser using our interactive demo. We provide both an embedded demo below and a [standalone browser test page](/browser-test.html) for comprehensive testing.

### Standalone Browser Test

For a complete testing experience, open the [browser-test.html](/browser-test.html) file in your browser. This standalone page includes:

- ✅ All logger features and methods
- ✅ Interactive test buttons
- ✅ Real-time console output
- ✅ Browser compatibility checks
- ✅ Performance testing

### Embedded Demo

You can also test basic functionality with the embedded demo below:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sherman Logger - Browser Demo</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
      }
      .container {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .console-note {
        background: #e3f2fd;
        border: 1px solid #2196f3;
        border-radius: 4px;
        padding: 15px;
        margin: 20px 0;
      }
      button {
        background: #2196f3;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        margin: 5px;
      }
      button:hover {
        background: #1976d2;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Sherman Logger - Browser Demo</h1>

      <div class="console-note">
        <strong>📝 Note:</strong> Open your browser's Developer Console (F12) to
        see the styled log outputs!
      </div>

      <h2>Basic Logger Tests</h2>
      <button onclick="testBasicLogging()">Test Basic Logging</button>
      <button onclick="testStyledLogging()">Test Styled Logging</button>
      <button onclick="testHighlights()">Test Highlights</button>
      <button onclick="testDividers()">Test Dividers</button>

      <h2>Stream Logger Tests</h2>
      <button onclick="testStreamLogger()">Test Stream Logger</button>
      <button onclick="testStreamStates()">Test Stream States</button>

      <h2>Advanced Tests</h2>
      <button onclick="testTimeAndPrefix()">Test Time & Prefix</button>
      <button onclick="testCustomTypes()">Test Custom Types</button>
    </div>

    <script type="module">
      import { logger } from "./dist/index.js";

      // Basic logging test
      window.testBasicLogging = () => {
        console.log(
          "%c=== Basic Logging Test ===",
          "font-weight: bold; font-size: 16px"
        );
        logger.info.text("This is an info message").print();
        logger.success.text("This is a success message").print();
        logger.error.text("This is an error message").print();
        logger.warn.text("This is a warning message").print();
      };

      // Styled logging test
      window.testStyledLogging = () => {
        console.log(
          "%c=== Styled Logging Test ===",
          "font-weight: bold; font-size: 16px"
        );
        logger.info
          .prefix("🎨 STYLE")
          .text("Styled message with prefix")
          .detail("This shows browser styling capabilities")
          .print();
      };

      // Highlights test
      window.testHighlights = () => {
        console.log(
          "%c=== Highlight Test ===",
          "font-weight: bold; font-size: 16px"
        );
        logger.info
          .text("This text has [[highlighted]] content in it")
          .detail("Highlights work with [[multiple]] [[words]]")
          .print();
      };

      // Dividers test
      window.testDividers = () => {
        console.log(
          "%c=== Divider Test ===",
          "font-weight: bold; font-size: 16px"
        );
        logger.info.divider("=", 40);
        logger.info.text("Content between dividers").print();
        logger.info.divider("-", 40);
      };

      // Stream logger test
      window.testStreamLogger = () => {
        console.log(
          "%c=== Stream Logger Test ===",
          "font-weight: bold; font-size: 16px"
        );
        const stream = logger.stream;

        stream.prefix("🔄 PROCESS").text("Starting process...");

        setTimeout(() => {
          stream.text("Processing data...").update();
        }, 1000);

        setTimeout(() => {
          stream.text("Finalizing...").update();
        }, 2000);

        setTimeout(() => {
          stream.text("Process completed successfully!").state("succeed");
        }, 3000);
      };

      // Stream states test
      window.testStreamStates = () => {
        console.log(
          "%c=== Stream States Test ===",
          "font-weight: bold; font-size: 16px"
        );
        const stream = logger.stream;

        stream.prefix("🎯 STATES").text("Testing different states...");

        setTimeout(() => {
          stream.text("Pausing process...").state("stop");
        }, 1000);

        setTimeout(() => {
          stream.text("Resuming process...").state("start");
        }, 2000);

        setTimeout(() => {
          stream.text("Process completed!").state("succeed");
        }, 3000);
      };

      // Time and prefix test
      window.testTimeAndPrefix = () => {
        console.log(
          "%c=== Time & Prefix Test ===",
          "font-weight: bold; font-size: 16px"
        );
        logger.info
          .time(true)
          .prefix("⏰ TIMED")
          .text("Message with timestamp")
          .detail("Shows current time")
          .print();
      };

      // Custom types test
      window.testCustomTypes = () => {
        console.log(
          "%c=== Custom Types Test ===",
          "font-weight: bold; font-size: 16px"
        );

        logger
          .type("custom", ["bgMagenta", "white", "bold"])
          .prefix("🎨 CUSTOM")
          .text("Custom styled log type")
          .print();

        logger
          .type("security", ["bgRed", "white", "bold"])
          .prefix("🔒 SECURITY")
          .text("Security alert message")
          .print();
      };

      // Initial welcome message
      logger.success
        .prefix("🎉 DEMO")
        .text("Sherman Logger browser demo ready!")
        .detail("Click buttons above to test features")
        .time()
        .print();
    </script>
  </body>
</html>
```

## Real-World Browser Examples

### Single Page Application (SPA)

```typescript
import { logger } from '@shermant/logger'

class SPALogger {
  // Route change logging
  static logRouteChange(from: string, to: string) {
    logger.info
      .prefix('🧭 ROUTE')
      .text('Navigation detected')
      .detail(`From: ${from}`)
      .detail(`To: ${to}`)
      .time()
      .print()
  }

  // API request logging
  static logApiRequest(method: string, url: string) {
    logger.info
      .prefix('📡 API')
      .text(`${method} request`)
      .detail(`URL: ${url}`)
      .time()
      .print()
  }

  // User action logging
  static logUserAction(action: string, element?: string) {
    logger.info
      .prefix('👤 USER')
      .text(`User action: ${action}`)
      .detail(element ? `Element: ${element}` : 'No element specified')
      .time()
      .print()
  }
}

// Usage in SPA
// Router integration
router.beforeEach((to, from) => {
  SPALogger.logRouteChange(from.path, to.path)
})

// API interceptor
axios.interceptors.request.use((config) => {
  SPALogger.logApiRequest(config.method.toUpperCase(), config.url)
  return config
})
```

### Error Tracking

```typescript
import { logger } from '@shermant/logger'

// Global error handler
window.addEventListener('error', (event) => {
  logger.error
    .prefix('🚨 ERROR')
    .text('JavaScript error detected')
    .detail(`Message: ${event.message}`)
    .detail(`File: ${event.filename}:${event.lineno}:${event.colno}`)
    .data({
      error: event.error?.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
    })
    .time()
    .print()
})

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  logger.error
    .prefix('🚨 PROMISE')
    .text('Unhandled promise rejection')
    .detail(`Reason: ${event.reason}`)
    .data({
      reason: event.reason,
      userAgent: navigator.userAgent,
      url: window.location.href,
    })
    .time()
    .print()
})

// Custom error boundary for React-like frameworks
class ErrorBoundary {
  static logError(error: Error, errorInfo: any) {
    logger.error
      .prefix('⚛️ REACT')
      .text('Component error boundary triggered')
      .detail(`Error: ${error.message}`)
      .data({
        error: error.stack,
        errorInfo,
        component: errorInfo.componentStack,
      })
      .time()
      .print()
  }
}
```

### Performance Monitoring

```typescript
import { logger } from '@shermant/logger'

class PerformanceLogger {
  // Page load performance
  static logPageLoad() {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming

      logger.info
        .prefix('⚡ PERF')
        .text('Page load performance')
        .detail(
          `DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`
        )
        .detail(
          `Load Complete: ${perfData.loadEventEnd - perfData.loadEventStart}ms`
        )
        .detail(`Total Time: ${perfData.loadEventEnd - perfData.fetchStart}ms`)
        .time()
        .print()
    })
  }

  // API response time
  static logApiPerformance(url: string, startTime: number) {
    const endTime = performance.now()
    const duration = endTime - startTime

    const logLevel = duration > 1000 ? logger.warn : logger.info

    logLevel
      .prefix('📊 API-PERF')
      .text('API response time')
      .detail(`URL: ${url}`)
      .detail(`Duration: ${duration.toFixed(2)}ms`)
      .time()
      .print()
  }

  // Memory usage (if available)
  static logMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory

      logger.info
        .prefix('💾 MEMORY')
        .text('Memory usage snapshot')
        .detail(`Used: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`)
        .detail(
          `Total: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`
        )
        .detail(
          `Limit: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
        )
        .time()
        .print()
    }
  }
}
```

### Local Storage Integration

```typescript
import { logger } from '@shermant/logger'

class StorageLogger {
  // Log storage operations
  static logStorageOperation(
    operation: 'set' | 'get' | 'remove',
    key: string,
    value?: any
  ) {
    logger.info
      .prefix('💾 STORAGE')
      .text(`${operation.toUpperCase()} operation`)
      .detail(`Key: ${key}`)
      .detail(
        value !== undefined ? `Value: ${JSON.stringify(value)}` : 'No value'
      )
      .time()
      .print()
  }

  // Monitor storage quota
  static async logStorageQuota() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()

      logger.info
        .prefix('📊 QUOTA')
        .text('Storage quota information')
        .detail(`Used: ${((estimate.usage || 0) / 1024 / 1024).toFixed(2)} MB`)
        .detail(
          `Available: ${((estimate.quota || 0) / 1024 / 1024).toFixed(2)} MB`
        )
        .detail(
          `Usage: ${(((estimate.usage || 0) / (estimate.quota || 1)) * 100).toFixed(1)}%`
        )
        .time()
        .print()
    }
  }
}

// Enhanced localStorage wrapper
const enhancedStorage = {
  setItem(key: string, value: any) {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
      StorageLogger.logStorageOperation('set', key, value)
    }
    catch (error) {
      logger.error
        .prefix('❌ STORAGE')
        .text('Failed to set localStorage item')
        .detail(`Key: ${key}`)
        .detail(`Error: ${error.message}`)
        .print()
    }
  },

  getItem(key: string) {
    try {
      const item = localStorage.getItem(key)
      const parsed = item ? JSON.parse(item) : null
      StorageLogger.logStorageOperation('get', key, parsed)
      return parsed
    }
    catch (error) {
      logger.error
        .prefix('❌ STORAGE')
        .text('Failed to get localStorage item')
        .detail(`Key: ${key}`)
        .detail(`Error: ${error.message}`)
        .print()
      return null
    }
  },
}
```

## Browser Limitations

### Console Styling Limitations

```typescript
import { logger } from '@shermant/logger'

// Some mobile browsers may not support full console styling
const isMobile
  = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

if (isMobile) {
  logger.warn
    .prefix('📱 MOBILE')
    .text('Mobile browser detected')
    .detail('Console styling may be limited')
    .print()
}
```

### Feature Detection

```typescript
import { logger } from '@shermant/logger'

// Check for required browser features
function checkBrowserSupport() {
  const features = {
    console: typeof console !== 'undefined',
    performance: typeof performance !== 'undefined',
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    fetch: typeof fetch !== 'undefined',
  }

  logger.info
    .prefix('🔍 SUPPORT')
    .text('Browser feature detection')
    .data(features)
    .print()

  return features
}
```

## Best Practices for Browser Usage

### 1. Environment Detection

```typescript
import { logger } from '@shermant/logger'

const isBrowser = typeof window !== 'undefined'
const isNode = typeof process !== 'undefined' && process.versions?.node

if (isBrowser) {
  logger.info.prefix('🌐 ENV').text('Running in browser').print()
}
else if (isNode) {
  logger.info.prefix('🖥️ ENV').text('Running in Node.js').print()
}
```

### 2. Conditional Logging

```typescript
import { logger } from '@shermant/logger'

// Only log in development
const isDevelopment
  = process.env.NODE_ENV === 'development'
  || window.location.hostname === 'localhost'

if (isDevelopment) {
  logger.debug.prefix('🔧 DEV').text('Development logging enabled').print()
}
```

### 3. Performance Considerations

```typescript
import { logger } from '@shermant/logger'

// Throttle high-frequency logging
let lastLogTime = 0
const LOG_THROTTLE = 100 // ms

function throttledLog(message: string) {
  const now = Date.now()
  if (now - lastLogTime > LOG_THROTTLE) {
    logger.info.text(message).print()
    lastLogTime = now
  }
}
```

The browser support in `@shermant/logger` ensures that you can use the same logging API across all your JavaScript environments while taking advantage of browser-specific features when available.
