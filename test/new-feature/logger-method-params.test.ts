import { describe, expect, it } from 'vitest'
import { Logger, logger } from '../../src'

describe('Logger Method Parameters Feature', () => {
  describe('text method with multiple parameters', () => {
    it('should concatenate multiple string parameters with spaces', () => {
      const result = logger.info.text('Hello', 'world', 'test').toString()
      expect(result).toContain('Hello world test')
    })

    it('should handle mixed parameter types', () => {
      const result = logger.info.text(1, {}, 'hi').toString()
      expect(result).toContain('1 [object Object] hi')
    })

    it('should handle single parameter', () => {
      const result = logger.info.text('single').toString()
      expect(result).toContain('single')
    })

    it('should handle empty parameters', () => {
      const result = logger.info.text().toString()
      expect(result).toContain('')
    })

    it('should handle null and undefined parameters', () => {
      const result = logger.info.text(null, undefined, 'test').toString()
      expect(result).toContain('null undefined test')
    })

    it('should handle array and object parameters', () => {
      const result = logger.info.text([1, 2, 3], { key: 'value' }, 'end').toString()
      expect(result).toContain('1,2,3 [object Object] end')
    })

    it('should preserve styles when using single string and styles array', () => {
      const result = logger.plain.text('styled text', ['bold']).toString()
      expect(result).toContain('styled text')
    })
  })

  describe('predefined logger types as methods', () => {
    it('should work with Logger.info() as method', () => {
      const result = Logger.info(1, {}, 'hi').data({}).toString()
      expect(result).toContain('1 [object Object] hi')
    })

    it('should work with Logger.warn() as method', () => {
      const result = Logger.warn('warning', 'message').toString()
      expect(result).toContain('warning message')
    })

    it('should work with Logger.error() as method', () => {
      const result = Logger.error('error', 'occurred').toString()
      expect(result).toContain('error occurred')
    })

    it('should work with Logger.success() as method', () => {
      const result = Logger.success('operation', 'completed').toString()
      expect(result).toContain('operation completed')
    })

    it('should work with logger.debug() as method', () => {
      const result = logger.debug('debug', 'info').toString()
      expect(result).toContain('debug info')
    })

    it('should work with logger.failure() as method', () => {
      const result = logger.failure('task', 'failed').toString()
      expect(result).toContain('task failed')
    })

    it('should work with logger.plain() as method', () => {
      const result = logger.plain('plain', 'text').toString()
      expect(result).toContain('plain text')
    })

    it('should return logger instance when called without parameters', () => {
      const result = logger.info()
      expect(result).toHaveProperty('text')
      expect(result).toHaveProperty('prefix')
      expect(result).toHaveProperty('print')
    })

    it('should be chainable after method call', () => {
      const result = logger.info('test', 'message').prefix('PREFIX').toString()
      expect(result).toContain('test message')
      expect(result).toContain('PREFIX')
    })
  })

  describe('Logger class static methods', () => {
    it('should work with Logger.info() as method', () => {
      const result = Logger.info('static', 'method').toString()
      expect(result).toContain('static method')
    })

    it('should work with Logger.warn() as method', () => {
      const result = Logger.warn('static', 'warning').toString()
      expect(result).toContain('static warning')
    })

    it('should work with Logger.error() as method', () => {
      const result = Logger.error('static', 'error').toString()
      expect(result).toContain('static error')
    })

    it('should maintain backward compatibility with getters', () => {
      const result = Logger.info.text('getter', 'usage').toString()
      expect(result).toContain('getter usage')
    })
  })

  describe('complex usage scenarios', () => {
    it('should handle the exact example from requirements', () => {
      const result = Logger.info(1, {}, 'hi').data({}).toString()
      expect(result).toContain('1 [object Object] hi')
    })

    it('should work with chaining after method call', () => {
      const result = Logger.info('initial', 'text')
        .prefix('TEST')
        .data({ key: 'value' })
        .toString()
      
      expect(result).toContain('initial text')
      expect(result).toContain('TEST')
    })

    it('should work with stream logger conversion', () => {
      const streamLogger = Logger.info('stream', 'test').toStream('STREAM')
      expect(streamLogger).toHaveProperty('update')
      expect(streamLogger).toHaveProperty('state')
    })

    it('should preserve logger type styling', () => {
      const infoResult = Logger.info('info', 'message').toString()
      const errorResult = Logger.error('error', 'message').toString()
      
      expect(infoResult).toContain('info message')
      expect(errorResult).toContain('error message')
      // Results should be different due to different styling
      expect(infoResult).not.toEqual(errorResult)
    })

    it('should work with custom types created via type method', () => {
      const customLogger = logger.type('custom', ['bgMagenta'])
      const result = customLogger.text('custom', 'type', 'test').toString()
      expect(result).toContain('custom type test')
    })
  })

  describe('edge cases', () => {
    it('should handle very long parameter lists', () => {
      const params = Array.from({ length: 20 }, (_, i) => `param${i}`)
      const result = logger.info(...params).toString()
      expect(result).toContain(params.join(' '))
    })

    it('should handle special characters in parameters', () => {
      const result = logger.info('special', '!@#$%^&*()', 'chars').toString()
      expect(result).toContain('special !@#$%^&*() chars')
    })

    it('should handle unicode characters', () => {
      const result = Logger.info('unicode', '🚀', '测试').toString()
      expect(result).toContain('unicode 🚀 测试')
    })

    it('should handle boolean parameters', () => {
      const result = Logger.info(true, false, 'boolean').toString()
      expect(result).toContain('true false boolean')
    })

    it('should handle number parameters including zero', () => {
      const result = Logger.info(0, 42, -1, 3.14).toString()
      expect(result).toContain('0 42 -1 3.14')
    })
  })
})