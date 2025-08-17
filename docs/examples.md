# Examples

This page provides comprehensive examples of using `@shermant/logger` in various scenarios and environments.

## Basic Examples

### Simple Logging

```typescript
import { logger } from '@shermant/logger'

// Basic log types
logger.info.text('Application started').print()
logger.success.text('Operation completed successfully!').print()
logger.warn.text('This is a warning message').print()
logger.error.text('This is an error message').print()
```

### Chainable API

```typescript
import { logger } from '@shermant/logger'

// Build complex log messages with method chaining
logger
  .info
  .prefix('🚀 APP')
  .text('Server starting on port 3000')
  .detail('Environment: development')
  .time()
  .print()

// Multiple details and data
logger
  .success
  .prefix('✅ DATABASE')
  .text('Connection established')
  .detail('Host: localhost:5432')
  .detail('Database: myapp_dev')
  .data({ connectionTime: '150ms', poolSize: 10 })
  .print()
```

## Cross-Platform Usage

The logger works seamlessly across different JavaScript environments:

### Node.js Environment

```typescript
// server.js
import { logger } from '@shermant/logger'

// Server startup logging
logger.info
  .prefix('🖥️  SERVER')
  .text('Starting Node.js server')
  .detail('Port: 3000')
  .time()
  .print()

// API request logging
logger.success
  .prefix('📡 API')
  .text('GET /api/users')
  .detail('Response time: 45ms')
  .data({ status: 200, count: 25 })
  .print()
```

### Browser Environment

```typescript
// client.js
import { logger } from '@shermant/logger'

// Client-side logging
logger.info
  .prefix('🌐 CLIENT')
  .text('Application initialized')
  .detail('User agent: Chrome/91.0')
  .print()

// User interaction logging
logger.success
  .prefix('👤 USER')
  .text('Login successful')
  .detail('Username: john.doe')
  .time()
  .print()
```

### Bun Environment

```typescript
// app.ts
import { logger } from '@shermant/logger'

// Bun-specific logging
logger.info
  .prefix('⚡ BUN')
  .text('Fast JavaScript runtime detected')
  .detail('Version: 1.0.0')
  .print()
```

## Advanced Examples

### Custom Log Types

```typescript
import { logger } from '@shermant/logger'

// Create custom log types
logger.type('security', ['bgRed', 'bold', 'white'])
  .prefix('🔒 SECURITY')
  .text('Authentication attempt detected')
  .detail('IP: 192.168.1.100')
  .print()

logger.type('performance', ['bgYellow', 'black'])
  .prefix('⚡ PERF')
  .text('Slow query detected')
  .detail('Duration: 2.5s')
  .data({ query: 'SELECT * FROM users', table: 'users' })
  .print()
```

### Highlights and Formatting

```typescript
import { logger } from '@shermant/logger'

// Using highlights with [[text]] syntax
logger.info
  .text('Processing [[important data]] with highlights')
  .detail('Found [[25 records]] in database')
  .print()

// Multiple highlights in one message
logger.warn
  .text('User [[john.doe]] attempted to access [[restricted area]]')
  .detail('Action: [[BLOCKED]]')
  .print()
```

### Dividers and Organization

```typescript
import { logger } from '@shermant/logger'

// Section dividers
logger.info.divider('=', 50)
logger.info.text('APPLICATION STARTUP').print()
logger.info.divider('=', 50)

logger.info.text('Loading configuration...').print()
logger.info.text('Connecting to database...').print()
logger.info.text('Starting HTTP server...').print()

logger.info.divider('-', 30)
logger.success.text('Application ready!').print()
logger.info.divider('-', 30)
```

## Stream Logger Examples

::: warning Browser Environment
The following stream logging examples are optimized for Node.js environments with interactive terminal support. In browser environments, stream operations output static console messages instead of interactive spinners, and action methods return `void` instead of `this`. See the [Browser Support](./browser-support.md#stream-logger-behavior-in-browsers) documentation for browser-specific usage patterns.
:::

### Basic Stream Usage

```typescript
import { logger } from '@shermant/logger'

// Initialize stream logger
const stream = logger.stream

// Start a process
stream
  .prefix('📦 INSTALL')
  .text('Installing packages...')

// Update progress
setTimeout(() => {
  stream.text('Downloading dependencies...').update()
}, 1000)

setTimeout(() => {
  stream.text('Building project...').update()
}, 2000)

// Complete with success
setTimeout(() => {
  stream.text('Installation completed!').state('succeed')
}, 3000)
```

### Stream with Error Handling

```typescript
import { logger } from '@shermant/logger'

const stream = logger.stream

try {
  stream.prefix('🔄 PROCESS').text('Starting data migration...')

  // Simulate async operation
  await performDataMigration()

  stream.text('Data migration completed successfully!').state('succeed')
}
catch (error) {
  stream.text(`Migration failed: ${error.message}`).state('fail')
}
```

### Multiple Stream States

```typescript
import { logger } from '@shermant/logger'

const deployStream = logger.stream

// Deployment process
deployStream.prefix('🚀 DEPLOY').text('Starting deployment...')

// Build phase
setTimeout(() => {
  deployStream.text('Building application...').update()
}, 500)

// Test phase
setTimeout(() => {
  deployStream.text('Running tests...').update()
}, 1500)

// Deploy phase
setTimeout(() => {
  deployStream.text('Deploying to production...').update()
}, 2500)

// Success
setTimeout(() => {
  deployStream.text('Deployment completed successfully!').state('succeed')
}, 3500)
```

## Real-World Scenarios

### API Server Logging

```typescript
import { logger } from '@shermant/logger'
import express from 'express'

const app = express()

// Middleware for request logging
app.use((req, res, next) => {
  logger.info
    .prefix('📡 REQUEST')
    .text(`${req.method} ${req.path}`)
    .detail(`IP: ${req.ip}`)
    .time()
    .print()
  next()
})

// Error handling
app.use((err, req, res, next) => {
  logger.error
    .prefix('❌ ERROR')
    .text('Unhandled error occurred')
    .detail(`Route: ${req.path}`)
    .data({ error: err.message, stack: err.stack })
    .print()
  next()
})
```

### Database Operations

```typescript
import { logger } from '@shermant/logger'

class DatabaseService {
  async connect() {
    const stream = logger.stream
    stream.prefix('🗄️  DB').text('Connecting to database...')

    try {
      // Simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000))

      stream.text('Database connected successfully!').state('succeed')

      logger.success
        .prefix('✅ DATABASE')
        .text('Connection pool initialized')
        .detail('Pool size: 10')
        .detail('Timeout: 30s')
        .print()
    }
    catch (error) {
      stream.text(`Connection failed: ${error.message}`).state('fail')
    }
  }

  async query(sql: string) {
    const startTime = Date.now()

    logger.info
      .prefix('🔍 QUERY')
      .text('Executing SQL query')
      .detail(`SQL: ${sql}`)
      .print()

    try {
      // Simulate query execution
      const result = await this.executeQuery(sql)
      const duration = Date.now() - startTime

      logger.success
        .prefix('✅ QUERY')
        .text('Query executed successfully')
        .detail(`Duration: ${duration}ms`)
        .detail(`Rows affected: ${result.rowCount}`)
        .print()

      return result
    }
    catch (error) {
      logger.error
        .prefix('❌ QUERY')
        .text('Query execution failed')
        .detail(`Error: ${error.message}`)
        .data({ sql, error: error.stack })
        .print()
      throw error
    }
  }
}
```

### File Processing

```typescript
import fs from 'node:fs/promises'
import { logger } from '@shermant/logger'

async function processFiles(directory: string) {
  logger.info.divider('=', 40)
  logger.info
    .prefix('📁 FILES')
    .text('Starting file processing')
    .detail(`Directory: ${directory}`)
    .time()
    .print()
  logger.info.divider('=', 40)

  const stream = logger.stream
  stream.prefix('🔄 SCAN').text('Scanning directory...')

  try {
    const files = await fs.readdir(directory)
    stream.text(`Found ${files.length} files`).update()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      stream.text(`Processing ${file} (${i + 1}/${files.length})`).update()

      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 100))

      logger.success
        .prefix('✅ FILE')
        .text(`Processed: ${file}`)
        .print()
    }

    stream.text('All files processed successfully!').state('succeed')

    logger.info.divider('-', 40)
    logger.success
      .prefix('🎉 COMPLETE')
      .text('File processing completed')
      .detail(`Total files: ${files.length}`)
      .time()
      .print()
    logger.info.divider('-', 40)
  }
  catch (error) {
    stream.text(`Processing failed: ${error.message}`).state('fail')
  }
}
```

## Browser-Specific Examples

### Interactive Web Application

```html
<!DOCTYPE html>
<html>
<head>
    <title>Logger Demo</title>
</head>
<body>
    <button onclick="testLogger()">Test Logger</button>
    <script type="module">
        import { logger } from './dist/index.js'

        window.testLogger = () => {
            logger.info
              .prefix('🌐 BROWSER')
              .text('Button clicked!')
              .detail('User interaction detected')
              .time()
              .print()

            logger.success
              .text('Check the console for styled output!')
              .print()
        }

        // Page load logging
        import { safeNavigator } from './dist/index.js'
        
        logger.info
          .prefix('📄 PAGE')
          .text('Page loaded successfully')
          .detail(`URL: ${window.location.href}`)
          .detail(`User Agent: ${safeNavigator.getUserAgent()}`)
          .time()
          .print()
    </script>
</body>
</html>
```

### Error Tracking

```typescript
import { logger } from '@shermant/logger'

// Global error handler
window.addEventListener('error', (event) => {
  logger.error
    .prefix('🚨 GLOBAL ERROR')
    .text('Unhandled JavaScript error')
    .detail(`Message: ${event.message}`)
    .detail(`File: ${event.filename}:${event.lineno}:${event.colno}`)
    .data({ error: event.error })
    .time()
    .print()
})

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  logger.error
    .prefix('🚨 PROMISE REJECTION')
    .text('Unhandled promise rejection')
    .detail(`Reason: ${event.reason}`)
    .time()
    .print()
})
```

## Testing Examples

### Unit Test Logging

```typescript
import { describe, expect, it } from 'vitest'
import { logger } from '@shermant/logger'

describe('User Service', () => {
  it('should create user successfully', async () => {
    logger.info
      .prefix('🧪 TEST')
      .text('Testing user creation')
      .detail('Test case: should create user successfully')
      .print()

    const user = await createUser({ name: 'John', email: 'john@example.com' })

    logger.success
      .prefix('✅ TEST')
      .text('User created successfully')
      .data({ userId: user.id, name: user.name })
      .print()

    expect(user).toBeDefined()
    expect(user.name).toBe('John')
  })
})
```

These examples demonstrate the versatility and power of `@shermant/logger` across different environments and use cases. The library's chainable API and rich feature set make it suitable for everything from simple debugging to complex application monitoring.
