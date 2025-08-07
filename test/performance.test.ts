import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Logger, StreamLogger, createLogger, logger } from '../src'

describe('performance Tests', () => {
  let startTime: number
  let endTime: number

  beforeEach(() => {
    startTime = performance.now()
  })

  afterEach(() => {
    endTime = performance.now()
    const duration = endTime - startTime
    // Most operations should complete within reasonable time
    expect(duration).toBeLessThan(1000) // 1 second max for any test
  })

  it('should create logger instances quickly', () => {
    const instances = []

    for (let i = 0; i < 1000; i++) {
      instances.push(Logger.type('perf_test'))
    }

    expect(instances.length).toBe(1000)
  })

  it('should handle large text efficiently', () => {
    const largeText = 'A'.repeat(100000) // 100KB of text

    const result = logger.info
      .prefix('LARGE')
      .text(largeText)
      .toString()

    expect(result.length).toBeGreaterThan(largeText.length)
  })

  it('should process complex styling quickly', () => {
    for (let i = 0; i < 100; i++) {
      logger
        .type(`perf_${i}`, ['bgRed', 'bold', 'underline'])
        .prefix(`PREFIX_${i}`)
        .text(`Performance test ${i}`)
        .detail(`Detail ${i}`)
        .time()
        .prependDivider('=', 50)
        .appendDivider('-', 30)
        .toString() // Convert to string instead of printing for speed
    }
  })

  it('should handle rapid method chaining', () => {
    let result = logger.info

    for (let i = 0; i < 1000; i++) {
      result = result
        .prefix(`CHAIN_${i}`)
        .text(`Chain ${i}`)
        .detail(`Detail ${i}`)
    }

    expect(result).toBeDefined()
  })

  it('should efficiently create custom loggers', () => {
    const customLoggers = []

    for (let i = 0; i < 100; i++) {
      const customLogger = createLogger()
      customLoggers.push(customLogger)
    }

    expect(customLoggers.length).toBe(100)
  })
})

describe('memory Usage Tests', () => {
  it('should not accumulate memory with repeated operations', () => {
    // Create many logger instances and ensure they can be garbage collected
    for (let i = 0; i < 1000; i++) {
      const temp = logger.info
        .prefix(`TEMP_${i}`)
        .text(`Temporary ${i}`)
        .toString()

      // Use the result to prevent optimization
      expect(temp.length).toBeGreaterThan(0)
    }
  })

  it('should handle large data objects without memory issues', () => {
    const largeData = {
      users: Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        metadata: {
          created: new Date().toISOString(),
          tags: [`tag${i}`, `category${i % 10}`],
          preferences: {
            theme: i % 2 === 0 ? 'dark' : 'light',
            notifications: true,
            language: 'en',
          },
        },
      })),
    }

    expect(() => {
      logger.info
        .prefix('LARGE_DATA')
        .text('Processing large dataset')
        .data(largeData)
        .toString()
    }).not.toThrow()
  })
})

describe('concurrent Usage Tests', () => {
  it('should handle concurrent logger creation', async () => {
    const promises = Array.from({ length: 50 }, async (_, i) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          logger
            .type(`concurrent_${i}`, ['bgBlue'])
            .prefix(`CONCURRENT_${i}`)
            .text(`Concurrent operation ${i}`)
            .toString()
          resolve()
        }, Math.random() * 10)
      })
    })

    await Promise.all(promises)
  })

  it('should handle concurrent StreamLogger operations', async () => {
    const streams = Array.from({ length: 10 }, (_, i) =>
      new StreamLogger(`Stream ${i}`, ['cyan']))

    const operations = streams.map(async (stream, i) => {
      stream.text(`Operation ${i}`)
      stream.detail(`Processing item ${i}`)
      await stream.asyncUpdate(10)
      stream.state('succeed')
      await stream.asyncUpdate(5)
    })

    await Promise.all(operations)
  })
})

describe('stress Tests', () => {
  it('should handle extreme method chaining', () => {
    let chain = logger.info

    // Chain 1000 operations
    for (let i = 0; i < 1000; i++) {
      chain = chain
        .prefix(`STRESS_${i}`)
        .text(`Stress test ${i}`)
    }

    expect(() => chain.toString()).not.toThrow()
  })

  it('should handle many custom types', () => {
    // Create 100 custom types
    for (let i = 0; i < 100; i++) {
      Logger.type(`stress_type_${i}`, ['bgMagenta', 'bold'])
    }

    // Use all custom types
    for (let i = 0; i < 100; i++) {
      expect(() => {
        Logger.type(`stress_type_${i}`)
          .prefix(`STRESS_${i}`)
          .text(`Using stress type ${i}`)
          .toString()
      }).not.toThrow()
    }
  })

  it('should handle rapid toString operations', () => {
    const instance = logger.info
      .prefix('RAPID')
      .text('Rapid toString test')
      .detail('Testing rapid conversion')
      .time()

    // Call toString 1000 times
    for (let i = 0; i < 1000; i++) {
      const result = instance.toString()
      expect(result.length).toBeGreaterThan(0)
    }
  })
})

describe('resource Cleanup Tests', () => {
  it('should properly clean up StreamLogger resources', async () => {
    const streams = []

    // Create many stream loggers
    for (let i = 0; i < 50; i++) {
      const stream = new StreamLogger(`Cleanup ${i}`, ['yellow'])
      stream.text(`Cleanup test ${i}`)
      streams.push(stream)
    }

    // Update all streams
    for (const stream of streams) {
      await stream.asyncUpdate(1)
      stream.state('succeed')
      await stream.asyncUpdate(1)
    }

    expect(streams.length).toBe(50)
  })

  it('should handle logger instance reuse efficiently', () => {
    const reusableLogger = Logger.type('reusable', ['bgGreen'])

    // Reuse the same instance many times
    for (let i = 0; i < 1000; i++) {
      const result = reusableLogger
        .prefix(`REUSE_${i}`)
        .text(`Reuse test ${i}`)
        .toString()

      expect(result.length).toBeGreaterThan(0)
    }
  })
})
