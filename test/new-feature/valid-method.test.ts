import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Logger } from '../../src/index'
import type { BaseLogger } from '../../src/logger/base'

describe('Logger valid() method', () => {
  let consoleSpy: any
  let processStdoutSpy: any

  beforeEach(() => {
    // Mock console.log and process.stdout.write to capture output
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    processStdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
  })

  describe('Basic functionality', () => {
    it('should return logger instance for method chaining', () => {
      const logger = Logger.info.valid(true)
      expect(logger).toBeInstanceOf(Object)
      expect(typeof logger.text).toBe('function')
      expect(typeof logger.print).toBe('function')
    })

    it('should default to true when no parameter provided', () => {
      const logger = Logger.info.valid()
      logger.text('Test message').print()
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should allow execution when valid(true)', () => {
      const logger = Logger.info.valid(true)
      logger.text('Test message').print()
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should prevent execution when valid(false)', () => {
      const logger = Logger.info.valid(false)
      logger.text('Test message').print()
      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })

  describe('Method chaining', () => {
    it('should work with method chaining before valid()', () => {
      const logger = Logger.type('info').prefix('APP').time().valid(false)
      logger.text('Test message').print()
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should work when starting with Logger.valid()', () => {
      const validLogger = Logger.valid(true)
      validLogger.text('Test message').print()
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should not output when starting with Logger.valid(false)', () => {
      const invalidLogger = Logger.valid(false)
      invalidLogger.text('Test message').print()
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should work with method chaining after valid()', () => {
      const logger = Logger.type('info').prefix('APP').time().valid(true)
      logger.text('Test message').print()
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should prevent execution in complex chain when valid(false)', () => {
      const logger = Logger.type('info').prefix('APP').time().valid(false)
      logger.text('Test message').detail('Additional info').print()
      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })

  describe('Predefined logger types', () => {
    it('should work with Logger.info.valid()', () => {
      Logger.info.valid(true).text('Info message').print()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockClear()
      Logger.info.valid(false).text('Info message').print()
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should work with Logger.warn.valid()', () => {
      Logger.warn.valid(true).text('Warning message').print()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockClear()
      Logger.warn.valid(false).text('Warning message').print()
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should work with Logger.error.valid()', () => {
      Logger.error.valid(true).text('Error message').print()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockClear()
      Logger.error.valid(false).text('Error message').print()
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should work with Logger.debug.valid()', () => {
      Logger.debug.valid(true).text('Debug message').print()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockClear()
      Logger.debug.valid(false).text('Debug message').print()
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should work with Logger.success.valid()', () => {
      Logger.success.valid(true).text('Success message').print()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockClear()
      Logger.success.valid(false).text('Success message').print()
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should work with Logger.failure.valid()', () => {
      Logger.failure.valid(true).text('Failure message').print()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockClear()
      Logger.failure.valid(false).text('Failure message').print()
      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })

  describe('Environment-based usage', () => {
    it('should work with environment variables simulation', () => {
      // Simulate development environment
      const isDev = true
      const logger = Logger.type('info').prefix('APP').time().valid(isDev)
      logger.text('Development message').print()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockClear()
      
      // Simulate production environment
      const isProd = false
      const prodLogger = Logger.type('info').prefix('APP').time().valid(isProd)
      prodLogger.text('Production message').print()
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should work with process.env simulation', () => {
      // Mock process.env.NODE_ENV
      const originalEnv = process.env.NODE_ENV
      
      process.env.NODE_ENV = 'development'
      const devLogger = Logger.type('info').prefix('APP').valid(process.env.NODE_ENV === 'development')
      devLogger.text('Dev environment message').print()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockClear()
      
      process.env.NODE_ENV = 'production'
      const prodLogger = Logger.type('info').prefix('APP').valid(process.env.NODE_ENV === 'development')
      prodLogger.text('Prod environment message').print()
      expect(consoleSpy).not.toHaveBeenCalled()
      
      // Restore original environment
      process.env.NODE_ENV = originalEnv
    })
  })

  describe('Complex scenarios', () => {
    it('should prevent all logger operations when valid(false)', () => {
      const logger = Logger.info.valid(false)
      
      // Test various operations
      logger.text('Test').detail('Detail').prefix('PREFIX').data({ key: 'value' }).print()
      logger.prependDivider().text('With divider').appendDivider().print()
      logger.divider()
      
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should work with multiple valid() calls (last one wins)', () => {
      const logger = Logger.info.valid(false).valid(true)
      logger.text('Should print').print()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockClear()
      
      const logger2 = Logger.info.valid(true).valid(false)
      logger2.text('Should not print').print()
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should maintain immutability - original logger unchanged', () => {
      const originalLogger = Logger.info
      const validLogger = originalLogger.valid(false)
      
      // Original logger should still work
      originalLogger.text('Original logger message').print()
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockClear()
      
      // Valid logger should not work
      validLogger.text('Valid logger message').print()
      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })

  describe('Stream logger compatibility', () => {
    it('should work with stream loggers', () => {
      const streamLogger = Logger.info.toStream('STREAM')
      
      // Test valid stream logger
      const validStream = streamLogger.valid(true)
      expect(typeof validStream.valid).toBe('function')
      expect(typeof validStream.update).toBe('function')
      
      // Test invalid stream logger
      const invalidStream = streamLogger.valid(false)
      expect(typeof invalidStream.valid).toBe('function')
      expect(typeof invalidStream.update).toBe('function')
    })
  })

  describe('Type safety', () => {
    it('should accept boolean parameters', () => {
      expect(() => Logger.info.valid(true)).not.toThrow()
      expect(() => Logger.info.valid(false)).not.toThrow()
    })

    it('should work with boolean expressions', () => {
      const condition = 1 > 0
      expect(() => Logger.info.valid(condition)).not.toThrow()
      
      const falseCondition = 1 < 0
      expect(() => Logger.info.valid(falseCondition)).not.toThrow()
    })
  })
})