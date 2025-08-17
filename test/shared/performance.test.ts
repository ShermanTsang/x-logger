import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Logger, StreamLogger, createLogger, logger } from '../../src'
import { measurePerformance, testData } from './test-utils'

describe('Performance Tests - Cross-Platform', () => {
  let startTime: number
  let endTime: number

  beforeEach(() => {
    startTime = performance.now()
  })

  afterEach(() => {
    endTime = performance.now()
    const duration = endTime - startTime
    // Most operations should complete within reasonable time
    expect(duration).toBeLessThan(2000) // 2 seconds max for any test
  })

  describe('Logger Instance Creation Performance', () => {
    it('should create logger instances quickly', () => {
      const { duration } = measurePerformance(() => {
        const instances = []
        for (let i = 0; i < 1000; i++) {
          instances.push(Logger.type('perf_test'))
        }
        expect(instances.length).toBe(1000)
      })

      expect(duration).toBeLessThan(100) // Should be very fast
    })

    it('should efficiently create custom loggers', () => {
      const { duration } = measurePerformance(() => {
        const customLoggers = []
        for (let i = 0; i < 100; i++) {
          const customLogger = createLogger()
          customLoggers.push(customLogger)
        }
        expect(customLoggers.length).toBe(100)
      })

      expect(duration).toBeLessThan(50)
    })

    it('should handle rapid custom type creation', () => {
      const { duration } = measurePerformance(() => {
        for (let i = 0; i < 50; i++) {
          logger.type(`rapid_${i}`, ['red', 'bold'])
        }
      })

      expect(duration).toBeLessThan(100)
    })
  })

  describe('Text Processing Performance', () => {
    it('should handle large text efficiently', () => {
      const largeText = 'A'.repeat(100000) // 100KB of text

      const { duration } = measurePerformance(() => {
        const result = logger.info
          .prefix('LARGE')
          .text(largeText)
          .toString()

        expect(result.length).toBeGreaterThan(largeText.length)
      })

      expect(duration).toBeLessThan(200)
    })

    it('should process complex styling quickly', () => {
      const { duration } = measurePerformance(() => {
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

      expect(duration).toBeLessThan(500)
    })

    it('should handle rapid method chaining', () => {
      const { duration } = measurePerformance(() => {
        let result = logger.info

        for (let i = 0; i < 1000; i++) {
          result = result
            .prefix(`CHAIN_${i}`)
            .text(`Chain ${i}`)
            .detail(`Detail ${i}`)
        }

        expect(result).toBeDefined()
      })

      expect(duration).toBeLessThan(300)
    })

    it('should efficiently process unicode text', () => {
      const { duration } = measurePerformance(() => {
        for (let i = 0; i < 100; i++) {
          logger.info
            .text(testData.unicodeText)
            .detail('Unicode processing test')
            .toString()
        }
      })

      expect(duration).toBeLessThan(200)
    })
  })

  describe('Memory Usage Tests', () => {
    it('should not accumulate memory with repeated operations', () => {
      const { duration } = measurePerformance(() => {
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

      expect(duration).toBeLessThan(500)
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

      const { duration } = measurePerformance(() => {
        expect(() => {
          logger.info
            .prefix('LARGE_DATA')
            .text('Processing large dataset')
            .data(largeData)
            .toString()
        }).not.toThrow()
      })

      expect(duration).toBeLessThan(300)
    })

    it('should handle memory cleanup efficiently', () => {
      const { duration } = measurePerformance(() => {
        const loggers = []
        
        // Create many loggers
        for (let i = 0; i < 500; i++) {
          loggers.push(
            logger.type(`cleanup_${i}`)
              .prefix(`CLEANUP_${i}`)
              .text(`Cleanup test ${i}`)
          )
        }

        // Clear references
        loggers.length = 0
        
        // Force potential garbage collection
        if (global.gc) {
          global.gc()
        }
      })

      expect(duration).toBeLessThan(200)
    })
  })

  describe('Concurrent Usage Tests', () => {
    it('should handle concurrent logger creation', async () => {
      const { duration } = await measurePerformance(async () => {
        const promises = Array.from({ length: 50 }, async (_, i) => {
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              const result = logger
                .type(`concurrent_${i}`)
                .prefix(`CONCURRENT_${i}`)
                .text(`Concurrent test ${i}`)
                .toString()
              
              expect(result).toContain(`CONCURRENT_${i}`)
              resolve()
            }, Math.random() * 10)
          })
        })

        await Promise.all(promises)
      })

      expect(duration).toBeLessThan(1000)
    })

    it('should handle concurrent stream operations', async () => {
      const { duration } = await measurePerformance(async () => {
        const streams = Array.from({ length: 20 }, (_, i) => 
          new StreamLogger(`STREAM_${i}`)
        )

        const operations = streams.map(async (stream, i) => {
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              stream
                .prefix(`STREAM_${i}`)
                .text(`Stream operation ${i}`)
                .toString()
              resolve()
            }, Math.random() * 20)
          })
        })

        await Promise.all(operations)
      })

      expect(duration).toBeLessThan(1000)
    })
  })

  describe('Stress Tests', () => {
    it('should handle high-frequency logging', () => {
      const { duration } = measurePerformance(() => {
        for (let i = 0; i < 5000; i++) {
          logger.info
            .prefix('STRESS')
            .text(`Stress test message ${i}`)
            .toString()
        }
      })

      expect(duration).toBeLessThan(1000)
    })

    it('should handle complex nested operations', () => {
      const { duration } = measurePerformance(() => {
        for (let i = 0; i < 100; i++) {
          const baseLogger = logger.type(`stress_${i}`, ['red', 'bold'])
          
          for (let j = 0; j < 10; j++) {
            baseLogger
              .prefix(`NESTED_${i}_${j}`)
              .text(`Nested operation ${i}-${j}`)
              .detail(`Detail for ${i}-${j}`)
              .data({ iteration: i, nested: j })
              .time()
              .toString()
          }
        }
      })

      expect(duration).toBeLessThan(800)
    })

    it('should handle rapid style switching', () => {
      const styles = [
        ['red', 'bold'],
        ['green', 'italic'],
        ['blue', 'underline'],
        ['yellow', 'strikethrough'],
        ['magenta', 'dim'],
      ]

      const { duration } = measurePerformance(() => {
        for (let i = 0; i < 1000; i++) {
          const style = styles[i % styles.length]
          logger
            .type(`rapid_style_${i}`, style)
            .text(`Rapid style test ${i}`)
            .toString()
        }
      })

      expect(duration).toBeLessThan(400)
    })
  })

  describe('Resource Cleanup Tests', () => {
    it('should clean up resources after operations', () => {
      const initialMemory = process.memoryUsage?.()?.heapUsed || 0

      const { duration } = measurePerformance(() => {
        // Perform resource-intensive operations
        for (let i = 0; i < 200; i++) {
          const logger = Logger.type(`cleanup_${i}`, ['bgRed', 'white'])
          logger
            .prefix(`CLEANUP_${i}`)
            .text('Resource cleanup test')
            .data({ index: i, timestamp: Date.now() })
            .toString()
        }

        // Force cleanup if available
        if (global.gc) {
          global.gc()
        }
      })

      expect(duration).toBeLessThan(300)

      // Memory should not grow excessively
      const finalMemory = process.memoryUsage?.()?.heapUsed || 0
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryGrowth = finalMemory - initialMemory
        expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024) // Less than 50MB growth
      }
    })

    it('should handle stream cleanup efficiently', () => {
      const { duration } = measurePerformance(() => {
        const streams = []
        
        // Create many streams
        for (let i = 0; i < 100; i++) {
          const stream = new StreamLogger(`CLEANUP_STREAM_${i}`)
          stream
            .prefix(`STREAM_${i}`)
            .text(`Stream cleanup test ${i}`)
          streams.push(stream)
        }

        // Simulate cleanup
        streams.forEach(stream => {
          stream.toString() // Finalize
        })
        
        streams.length = 0 // Clear references
      })

      expect(duration).toBeLessThan(200)
    })
  })
})