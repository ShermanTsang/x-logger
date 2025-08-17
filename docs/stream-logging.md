# Stream Logging

Stream logging is one of the most powerful features of `@shermant/logger`, providing real-time, interactive logging with spinners, progress indicators, and state management. This feature is perfect for long-running operations, progress tracking, and dynamic status updates.

## Overview

Stream logging allows you to:
- Display interactive spinners during operations
- Update log messages in real-time
- Show different states (start, stop, succeed, fail)
- Create progress indicators
- Provide visual feedback for long-running processes

## Browser Environment Limitations

::: warning Browser Compatibility
Stream logging is primarily designed for Node.js environments. In browser environments, stream logging has limited functionality due to the lack of interactive terminal capabilities.
:::

### Browser vs Node.js Behavior

**Node.js Environment:**
- Full interactive streaming with spinners and real-time updates
- Methods return `this` for chaining (e.g., `stream.text('...').update()`)
- Real-time terminal manipulation and cursor control

**Browser Environment:**
- Static console logging only (no interactive spinners)
- Action methods (`update()`, `state()`, `succeed()`, `fail()`, `start()`, `stop()`) return `void`
- Setup methods (`prefix()`, `text()`, `detail()`, `delay()`) still return `this` for chaining
- Output appears in browser console as regular log messages

### Browser Usage Example

```typescript
import { logger } from '@shermant/logger'

const stream = logger.stream

// Setup methods can still be chained
stream
  .prefix('📦 INSTALL')
  .text('Installing packages...')
  .detail('This will appear in console')

// Action methods return void in browser
stream.update() // Returns void, cannot chain further

// Correct browser usage
stream.text('Installation completed!')
stream.state('succeed') // Returns void
```

### Environment Detection

The logger automatically detects the environment and adjusts behavior accordingly:

```typescript
// This works in both environments, but behavior differs
const stream = logger.stream
  .prefix('🔄 PROCESS')
  .text('Processing...')

// In Node.js: Interactive spinner with real-time updates
// In Browser: Static console log messages
stream.update()
```

## Basic Stream Usage

### Simple Stream Example

```typescript
import { logger } from '@shermant/logger'

// Get the stream logger instance
const stream = logger.stream

// Start a process
stream
  .prefix('📦 INSTALL')
  .text('Installing packages...')

// Update the message
setTimeout(() => {
  stream.text('Downloading dependencies...').update()
}, 1000)

// Complete with success
setTimeout(() => {
  stream.text('Installation completed!').state('succeed')
}, 2000)
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

## Stream States

The stream logger supports four different states:

| State | Description | Visual Indicator |
|-------|-------------|------------------|
| `start` | Initial state with spinner | Spinning animation |
| `stop` | Paused state | Static indicator |
| `succeed` | Success state | ✓ Green checkmark |
| `fail` | Failure state | ✗ Red cross |

### State Examples

```typescript
import { logger } from '@shermant/logger'

const stream = logger.stream

// Start state (default)
stream.prefix('🚀 DEPLOY').text('Starting deployment...')

// Stop state
setTimeout(() => {
  stream.text('Deployment paused').state('stop')
}, 1000)

// Resume (back to start state)
setTimeout(() => {
  stream.text('Resuming deployment...').state('start')
}, 2000)

// Success state
setTimeout(() => {
  stream.text('Deployment completed successfully!').state('succeed')
}, 3000)

// For error scenarios
// stream.text('Deployment failed!').state('fail')
```

## Advanced Stream Features

### Multiple Stream Updates

```typescript
import { logger } from '@shermant/logger'

const stream = logger.stream

// Initialize
stream.prefix('📊 ANALYSIS').text('Starting data analysis...')

// Progress updates
const steps = [
  'Loading dataset...',
  'Preprocessing data...',
  'Running algorithms...',
  'Generating insights...',
  'Creating visualizations...',
  'Finalizing report...'
]

let currentStep = 0

function updateProgress() {
  if (currentStep < steps.length) {
    stream.text(`${steps[currentStep]} (${currentStep + 1}/${steps.length})`).update()
    currentStep++
    setTimeout(updateProgress, 800)
  }
  else {
    stream.text('Analysis completed successfully!').state('succeed')
  }
}

// Start progress updates
setTimeout(updateProgress, 500)
```

### Stream with Details

```typescript
import { logger } from '@shermant/logger'

const stream = logger.stream

// Stream with additional details
stream
  .prefix('🔄 BACKUP')
  .text('Creating database backup...')
  .detail('Database: production_db')
  .detail('Size: 2.5GB')

// Update with new details
setTimeout(() => {
  stream
    .text('Compressing backup file...')
    .detail('Progress: 45%')
    .detail('Estimated time: 2 minutes')
    .update()
}, 2000)

// Final state
setTimeout(() => {
  stream
    .text('Backup completed successfully!')
    .detail('File: backup_2024_01_15.sql.gz')
    .detail('Size: 850MB')
    .state('succeed')
}, 5000)
```

### Stream with Custom Styling

```typescript
import { logger } from '@shermant/logger'

const stream = logger.stream

// Apply custom styling to stream
stream
  .style(['bgMagenta', 'white', 'bold'])
  .prefix('🎨 CUSTOM')
  .text('Processing with custom styling...')

// Update with different styling
setTimeout(() => {
  stream
    .style(['bgCyan', 'black'])
    .text('Styling updated!')
    .update()
}, 1500)

// Complete
setTimeout(() => {
  stream
    .style(['bgGreen', 'black'])
    .text('Custom styling completed!')
    .state('succeed')
}, 3000)
```

## Real-World Examples

### File Processing

```typescript
import fs from 'node:fs/promises'
import path from 'node:path'
import { logger } from '@shermant/logger'

async function processFiles(directory: string) {
  const stream = logger.stream

  try {
    stream.prefix('📁 FILES').text('Scanning directory...')

    const files = await fs.readdir(directory)
    stream.text(`Found ${files.length} files`).update()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const progress = Math.round(((i + 1) / files.length) * 100)

      stream
        .text(`Processing ${file}`)
        .detail(`Progress: ${progress}% (${i + 1}/${files.length})`)
        .update()

      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    stream
      .text('All files processed successfully!')
      .detail(`Total files: ${files.length}`)
      .state('succeed')
  }
  catch (error) {
    stream
      .text(`File processing failed: ${error.message}`)
      .state('fail')
  }
}
```

### API Data Fetching

```typescript
import { logger } from '@shermant/logger'

async function fetchUserData(userIds: string[]) {
  const stream = logger.stream

  stream.prefix('📡 API').text('Fetching user data...')

  const results = []
  const errors = []

  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i]
    const progress = Math.round(((i + 1) / userIds.length) * 100)

    stream
      .text(`Fetching user ${userId}`)
      .detail(`Progress: ${progress}%`)
      .detail(`Completed: ${i}/${userIds.length}`)
      .update()

    try {
      const userData = await fetchUser(userId)
      results.push(userData)
    }
    catch (error) {
      errors.push({ userId, error: error.message })
    }
  }

  if (errors.length === 0) {
    stream
      .text('All user data fetched successfully!')
      .detail(`Users fetched: ${results.length}`)
      .state('succeed')
  }
  else {
    stream
      .text(`Fetch completed with ${errors.length} errors`)
      .detail(`Successful: ${results.length}`)
      .detail(`Failed: ${errors.length}`)
      .state('fail')
  }

  return { results, errors }
}
```

### Database Migration

```typescript
import { logger } from '@shermant/logger'

class DatabaseMigrator {
  private stream = logger.stream

  async runMigrations(migrations: Migration[]) {
    this.stream.prefix('🗄️  DB').text('Starting database migration...')

    try {
      for (let i = 0; i < migrations.length; i++) {
        const migration = migrations[i]
        const progress = Math.round(((i + 1) / migrations.length) * 100)

        this.stream
          .text(`Running migration: ${migration.name}`)
          .detail(`Step ${i + 1} of ${migrations.length}`)
          .detail(`Progress: ${progress}%`)
          .update()

        await this.runMigration(migration)

        // Log individual migration success
        logger.success
          .prefix('✅ MIGRATION')
          .text(`Completed: ${migration.name}`)
          .print()
      }

      this.stream
        .text('All migrations completed successfully!')
        .detail(`Total migrations: ${migrations.length}`)
        .state('succeed')
    }
    catch (error) {
      this.stream
        .text(`Migration failed: ${error.message}`)
        .detail('Database may be in inconsistent state')
        .state('fail')

      throw error
    }
  }

  private async runMigration(migration: Migration) {
    // Migration logic here
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
```

### Build Process

```typescript
import { logger } from '@shermant/logger'

class BuildManager {
  private stream = logger.stream

  async build(project: string) {
    this.stream.prefix('🔨 BUILD').text('Starting build process...')

    const steps = [
      { name: 'Clean', action: () => this.clean() },
      { name: 'Install dependencies', action: () => this.installDeps() },
      { name: 'Type checking', action: () => this.typeCheck() },
      { name: 'Compile TypeScript', action: () => this.compile() },
      { name: 'Bundle assets', action: () => this.bundle() },
      { name: 'Run tests', action: () => this.test() },
      { name: 'Generate docs', action: () => this.generateDocs() }
    ]

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        const progress = Math.round(((i + 1) / steps.length) * 100)

        this.stream
          .text(`${step.name}...`)
          .detail(`Step ${i + 1}/${steps.length}`)
          .detail(`Progress: ${progress}%`)
          .update()

        await step.action()
      }

      this.stream
        .text('Build completed successfully!')
        .detail(`Project: ${project}`)
        .detail('Ready for deployment')
        .state('succeed')
    }
    catch (error) {
      this.stream
        .text(`Build failed: ${error.message}`)
        .detail('Check logs for details')
        .state('fail')

      throw error
    }
  }

  private async clean() { /* Clean logic */ }
  private async installDeps() { /* Install logic */ }
  private async typeCheck() { /* Type check logic */ }
  private async compile() { /* Compile logic */ }
  private async bundle() { /* Bundle logic */ }
  private async test() { /* Test logic */ }
  private async generateDocs() { /* Docs logic */ }
}
```

## Stream Timing and Delays

### Controlled Timing

```typescript
import { logger } from '@shermant/logger'

const stream = logger.stream

// Use delay for controlled timing
stream
  .prefix('⏱️  TIMER')
  .text('Starting timed process...')
  .delay(1000) // Wait 1 second before starting

// Chain delays for sequential updates
setTimeout(() => {
  stream
    .text('Step 1 completed')
    .delay(500)
    .update()
}, 1000)

setTimeout(() => {
  stream
    .text('Step 2 completed')
    .delay(500)
    .update()
}, 2000)

setTimeout(() => {
  stream
    .text('All steps completed!')
    .state('succeed')
}, 3000)
```

### Async/Await with Streams

```typescript
import { logger } from '@shermant/logger'

async function asyncStreamExample() {
  const stream = logger.stream

  stream.prefix('🔄 ASYNC').text('Starting async operation...')

  // Wait for async operation
  await new Promise(resolve => setTimeout(resolve, 1000))
  stream.text('First phase completed').update()

  // Another async operation
  await new Promise(resolve => setTimeout(resolve, 1500))
  stream.text('Second phase completed').update()

  // Final async operation
  await new Promise(resolve => setTimeout(resolve, 800))
  stream.text('All phases completed!').state('succeed')
}
```

## Best Practices

### Error Handling

```typescript
import { logger } from '@shermant/logger'

async function robustStreamOperation() {
  const stream = logger.stream

  try {
    stream.prefix('🛡️  ROBUST').text('Starting operation...')

    // Wrap risky operations
    await performRiskyOperation()

    stream.text('Operation completed successfully!').state('succeed')
  }
  catch (error) {
    // Always handle errors gracefully
    stream
      .text(`Operation failed: ${error.message}`)
      .detail('Check logs for more information')
      .state('fail')

    // Log additional error details
    logger.error
      .prefix('❌ ERROR')
      .text('Detailed error information')
      .data({ error: error.stack })
      .print()
  }
}
```

### Resource Cleanup

```typescript
import { logger } from '@shermant/logger'

class StreamManager {
  private activeStreams = new Set<any>()

  createStream(prefix: string) {
    const stream = logger.stream.prefix(prefix)
    this.activeStreams.add(stream)
    return stream
  }

  async cleanup() {
    // Ensure all streams are properly closed
    for (const stream of this.activeStreams) {
      try {
        stream.text('Operation interrupted').state('stop')
      }
      catch (error) {
        // Handle cleanup errors
      }
    }
    this.activeStreams.clear()
  }
}
```

### Performance Considerations

```typescript
import { logger } from '@shermant/logger'

// Avoid too frequent updates
const stream = logger.stream
let lastUpdate = 0

function updateProgress(current: number, total: number) {
  const now = Date.now()

  // Throttle updates to avoid performance issues
  if (now - lastUpdate > 100) { // Update at most every 100ms
    const progress = Math.round((current / total) * 100)
    stream
      .text(`Processing item ${current}/${total}`)
      .detail(`Progress: ${progress}%`)
      .update()

    lastUpdate = now
  }
}
```

Stream logging provides a powerful way to create interactive, real-time logging experiences that keep users informed about long-running operations and provide immediate feedback on process status.
