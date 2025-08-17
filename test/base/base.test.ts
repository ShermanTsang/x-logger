import { describe, expect, it } from 'vitest'
import { BaseLogger, BaseStreamLogger } from '../../src/logger/base'
import type { Type } from '../../src/typings'
import { testData, validateLoggerOutput } from '../shared/test-utils'

// Concrete implementation for testing abstract BaseLogger
class TestLogger extends BaseLogger {
  decorateText(content: string, styles?: Type.Styles): string {
    // Simple mock implementation for testing
    return styles && styles.length > 0 ? `[${styles.join(',')}]${content}[/${styles.join(',')}]` : content
  }

  printOutput(output: string): void {
    // Mock implementation - just store the output
    ;(this as any)._lastOutput = output
  }

  printDivider(text: string, styles: Type.Styles): void {
    this.printOutput(this.decorateText(text, styles))
  }

  toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger {
    return new TestStreamLogger(prefix, prefixStyles)
  }

  getLastOutput(): string {
    return (this as any)._lastOutput || ''
  }
}

// Concrete implementation for testing abstract BaseStreamLogger
class TestStreamLogger extends BaseStreamLogger {
  private _outputs: string[] = []
  private _states: Type.StreamLoggerState[] = []

  decorateText(content: string, styles?: Type.Styles): string {
    // Simple mock implementation for testing
    return styles && styles.length > 0 ? `[${styles.join(',')}]${content}[/${styles.join(',')}]` : content
  }

  printOutput(output: string): void {
    // Mock implementation - just store the output
    this._outputs.push(output)
  }

  printDivider(text: string, styles: Type.Styles): void {
    this.printOutput(this.decorateText(text, styles))
  }

  toStream(prefix?: string, prefixStyles?: Type.Styles): BaseStreamLogger {
    return new TestStreamLogger(prefix, prefixStyles)
  }

  initializeStream(): void {
    this._outputs.push('INIT')
  }

  updateStream(output: string): void {
    this._outputs.push(output)
  }

  finalizeStream(state: Type.StreamLoggerState, output: string): void {
    this._states.push(state)
    this._outputs.push(`FINAL:${state}:${output}`)
  }

  getOutputs(): string[] {
    return [...this._outputs]
  }

  getStates(): Type.StreamLoggerState[] {
    return [...this._states]
  }
}

describe('baseLogger Abstract Functionality', () => {
  describe('basic Logger Operations', () => {
    it('should create logger instance with default values', () => {
      const logger = new TestLogger()
      expect(logger).toBeInstanceOf(BaseLogger)
      expect(logger.toString()).toBe('')
    })

    it('should handle text operations', () => {
      const logger = new TestLogger()
      const modifiedLogger = logger.text('Hello World')
      const output = modifiedLogger.toString()
      expect(output).toContain('Hello World')
    })

    it('should handle prefix operations', () => {
      const logger = new TestLogger()
      const modifiedLogger = logger.prefix('INFO').text('Test message')
      const output = modifiedLogger.toString()
      expect(output).toContain('INFO')
      expect(output).toContain('Test message')
    })

    it('should handle detail operations', () => {
      const logger = new TestLogger()
      const modifiedLogger = logger.text('Main text').detail('Additional details')
      const output = modifiedLogger.toString()
      expect(output).toContain('Main text')
      expect(output).toContain('Additional details')
    })

    it('should handle data operations', () => {
      const logger = new TestLogger()
      const testObj = { key: 'value', number: 42 }
      const modifiedLogger = logger.data(testObj)
      const output = modifiedLogger.toString()
      expect(output).toContain('key')
      expect(output).toContain('value')
    })
  })

  describe('styling and Decoration', () => {
    it('should apply text styles', () => {
      const logger = new TestLogger()
      const modifiedLogger = logger.text('Styled text', ['red', 'bold'])
      const output = modifiedLogger.toString()
      expect(output).toContain('[red,bold]Styled text[/red,bold]')
    })

    it('should apply prefix styles', () => {
      const logger = new TestLogger()
      const modifiedLogger = logger.prefix('STYLED', ['bgGreen']).text('Message')
      const output = modifiedLogger.toString()
      expect(output).toContain('[bgGreen]STYLED[/bgGreen]')
    })

    it('should handle empty styles gracefully', () => {
      const logger = new TestLogger()
      const modifiedLogger = logger.text('No styles', [])
      const output = modifiedLogger.toString()
      expect(output).toContain('No styles')
      expect(output).not.toContain('[]')
    })
  })

  describe('time Display', () => {
    it('should include time when enabled', () => {
      const logger = new TestLogger()
      const modifiedLogger = logger.time(true).text('Timed message')
      const output = modifiedLogger.toString()
      expect(validateLoggerOutput(output).hasTimestamp()).toBe(true)
    })

    it('should not include time when disabled', () => {
      const logger = new TestLogger()
      const modifiedLogger = logger.time(false).text('No time message')
      const output = modifiedLogger.toString()
      expect(validateLoggerOutput(output).hasTimestamp()).toBe(false)
    })
  })

  describe('divider Operations', () => {
    it('should handle prepend divider', () => {
      const logger = new TestLogger()
      const modifiedLogger = logger.prependDivider('=', 10).text('Message')
      const output = modifiedLogger.toString()
      expect(output).toContain('=')
    })

    it('should handle append divider', () => {
      const logger = new TestLogger()
      const modifiedLogger = logger.text('Message').appendDivider('-', 5)
      const output = modifiedLogger.toString()
      expect(output).toContain('-')
    })

    it('should handle single divider', () => {
      const logger = new TestLogger()
      logger.divider('*', 8)
      const output = logger.toString()
      expect(output).toContain('*')
    })
  })

  describe('edge Cases and Error Handling', () => {
    it('should handle empty strings', () => {
      const logger = new TestLogger()
      expect(() => {
        logger.prefix('').text('').detail('')
      }).not.toThrow()
    })

    it('should handle null and undefined values', () => {
      const logger = new TestLogger()
      expect(() => {
        logger.data(null)
        logger.data(undefined)
      }).not.toThrow()
    })

    it('should handle very long text', () => {
      const logger = new TestLogger()
      let modifiedLogger: TestLogger
      expect(() => {
        modifiedLogger = logger.text(testData.longText)
      }).not.toThrow()
      const output = modifiedLogger!.toString()
      expect(output).toContain(testData.longText)
    })

    it('should handle unicode characters', () => {
      const logger = new TestLogger()
      const modifiedLogger = logger.text(testData.unicodeText)
      const output = modifiedLogger.toString()
      expect(output).toContain(testData.unicodeText)
    })
  })

  describe('method Chaining', () => {
    it('should support method chaining', () => {
      const logger = new TestLogger()
      const result = logger
        .prefix('CHAIN')
        .text('Chained message')
        .detail('Chained detail')
        .time()
        .prependDivider()
        .appendDivider()

      expect(result).not.toBe(logger) // With immutability, result should be a different instance
      const output = result.toString()
      expect(output).toContain('CHAIN')
      expect(output).toContain('Chained message')
      expect(output).toContain('Chained detail')
    })
  })

  describe('static Type Management', () => {
    it('should track registered types', () => {
      // const initialCount = BaseLogger.registeredTypes.length
      // This would be tested in concrete implementations
      expect(BaseLogger.registeredTypes).toBeInstanceOf(Array)
    })

    it('should have default styles map', () => {
      expect(BaseLogger.stylesMap).toBeDefined()
      expect(BaseLogger.stylesMap.info).toBeDefined()
      expect(BaseLogger.stylesMap.error).toBeDefined()
      expect(BaseLogger.stylesMap.warn).toBeDefined()
    })
  })

  describe('object Conversion', () => {
    it('should convert to object representation', () => {
      const logger = new TestLogger()
      const modifiedLogger = logger.prefix('TEST').text('Message').detail('Detail')
      const obj = modifiedLogger.toObject()

      expect(obj).toHaveProperty('prefix', 'TEST')
      expect(obj).toHaveProperty('text', 'Message')
      expect(obj).toHaveProperty('detail', 'Detail')
    })

    it('should have correct Symbol.toStringTag', () => {
      const logger = new TestLogger()
      expect(logger[Symbol.toStringTag]).toBe('ShermanLogger')
    })
  })
})

describe('baseStreamLogger Abstract Functionality', () => {
  describe('stream Logger Creation', () => {
    it('should create stream logger with prefix', () => {
      const stream = new TestStreamLogger('STREAM', ['cyan'])
      expect(stream).toBeInstanceOf(BaseStreamLogger)
      expect(stream).toBeInstanceOf(BaseLogger)
    })

    it('should initialize stream correctly', () => {
      const stream = new TestStreamLogger('INIT')
      stream.initializeStream()
      expect(stream.getOutputs()).toContain('INIT')
    })
  })

  describe('stream Operations', () => {
    it('should handle text updates', () => {
      const stream = new TestStreamLogger('UPDATE')
      stream.text('Initial text')
      stream.text('Updated text')

      const outputs = stream.getOutputs()
      expect(outputs.length).toBeGreaterThan(0)
    })

    it('should handle detail updates', () => {
      const stream = new TestStreamLogger('DETAIL')
      stream.detail('Initial detail')
      stream.detail('Updated detail')

      expect(stream.toString()).toContain('Updated detail')
    })

    it('should handle state changes', () => {
      const stream = new TestStreamLogger('STATE')
      stream.state('start')
      stream.state('succeed')

      const states = stream.getStates()
      expect(states).toContain('start')
      expect(states).toContain('succeed')
    })
  })

  describe('stream State Management', () => {
    it('should handle succeed state', () => {
      const stream = new TestStreamLogger('SUCCESS')
      stream.succeed('Success message')

      const outputs = stream.getOutputs()
      expect(outputs.some(output => output.includes('succeed'))).toBe(true)
    })

    it('should handle fail state', () => {
      const stream = new TestStreamLogger('FAILURE')
      stream.fail('Error message')

      const outputs = stream.getOutputs()
      expect(outputs.some(output => output.includes('fail'))).toBe(true)
    })

    it('should handle start state', () => {
      const stream = new TestStreamLogger('START')
      stream.start('Starting process')

      const outputs = stream.getOutputs()
      expect(outputs.some(output => output.includes('start'))).toBe(true)
    })

    it('should handle stop state', () => {
      const stream = new TestStreamLogger('STOP')
      stream.stop('Stopping process')

      const outputs = stream.getOutputs()
      expect(outputs.some(output => output.includes('stop'))).toBe(true)
    })
  })

  describe('async Operations', () => {
    it('should handle async updates', async () => {
      const stream = new TestStreamLogger('ASYNC')
      stream.delay(10)

      await stream.asyncUpdate()
      expect(stream.getOutputs().length).toBeGreaterThan(0)
    })

    it('should handle delay configuration', () => {
      const stream = new TestStreamLogger('DELAY')
      const result = stream.delay(100)
      expect(result).toBe(stream) // Should return this for chaining
    })
  })

  describe('stream Logger Edge Cases', () => {
    it('should handle empty text updates', () => {
      const stream = new TestStreamLogger('EMPTY')
      expect(() => {
        stream.text('')
        stream.detail('')
      }).not.toThrow()
    })

    it('should handle rapid state changes', () => {
      const stream = new TestStreamLogger('RAPID')
      expect(() => {
        stream.state('start')
        stream.state('succeed')
        stream.state('fail')
        stream.state('stop')
      }).not.toThrow()
    })

    it('should maintain method chaining', () => {
      const stream = new TestStreamLogger('CHAIN')
      const result = stream
        .text('Chained text')
        .detail('Chained detail')
        .delay(50)
        .state('start')

      expect(result).toBe(stream)
    })
  })
})
