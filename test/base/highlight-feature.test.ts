import { describe, expect, it } from 'vitest'
import { logger } from '../../src'

describe('highlight Feature [[text]] Pattern', () => {
  describe('node.js Environment', () => {
    it('should highlight text in [[]] brackets with chalk styling', () => {
      const result = logger.info.text('This has [[highlighted]] text').toString()

      // Should contain the highlighted text without brackets
      expect(result).toContain('highlighted')
      // Should not contain the brackets in final output
      expect(result).not.toContain('[[highlighted]]')
    })

    it('should handle multiple highlighted sections', () => {
      const result = logger.info.text('Text with [[first]] and [[second]] highlights').toString()

      expect(result).toContain('first')
      expect(result).toContain('second')
      expect(result).not.toContain('[[first]]')
      expect(result).not.toContain('[[second]]')
    })

    it('should work with text() method parameters', () => {
      const result = logger.info.text('Normal text with [[highlighted]] content').toString()

      expect(result).toContain('Normal text with')
      expect(result).toContain('highlighted')
      expect(result).toContain('content')
      expect(result).not.toContain('[[highlighted]]')
    })

    it('should preserve highlighting when using styles', () => {
      const result = logger.info.text('Styled text with [[highlighted]] content', ['bold']).toString()

      expect(result).toContain('highlighted')
      expect(result).not.toContain('[[highlighted]]')
    })

    it('should handle nested brackets correctly', () => {
      const result = logger.info.text('Text with [[nested [content] here]]').toString()

      expect(result).toContain('nested [content] here')
      expect(result).not.toContain('[[nested [content] here]]')
    })

    it('should handle empty highlight brackets', () => {
      const result = logger.info.text('Text with [[]] empty brackets').toString()

      expect(result).toContain('Text with')
      expect(result).toContain('empty brackets')
    })

    it('should handle single bracket without pair', () => {
      const result = logger.info.text('Text with [single] bracket').toString()

      // Single brackets should remain unchanged
      expect(result).toContain('[single]')
    })
  })

  describe('browser Environment Simulation', () => {
    // These tests would need to be run in a browser environment
    // or with proper browser simulation to test the actual console.log output
    it('should prepare text for browser highlighting', () => {
      const result = logger.info.text('Browser text with [[highlighted]] content').toString()

      // The toString() method should show the processed text
      expect(result).toContain('highlighted')
      expect(result).not.toContain('[[highlighted]]')
    })
  })

  describe('edge Cases', () => {
    it('should handle malformed brackets', () => {
      const result = logger.info.text('Text with [[unclosed bracket').toString()

      // Malformed brackets should remain unchanged
      expect(result).toContain('[[unclosed bracket')
    })

    it('should handle multiple consecutive highlights', () => {
      const result = logger.info.text('[[first]][[second]][[third]]').toString()

      expect(result).toContain('first')
      expect(result).toContain('second')
      expect(result).toContain('third')
      expect(result).not.toContain('[[')
      expect(result).not.toContain(']]')
    })

    it('should handle highlights with special characters', () => {
      const result = logger.info.text('Text with [[special!@#$%^&*()]] characters').toString()

      expect(result).toContain('special!@#$%^&*()')
      expect(result).not.toContain('[[special!@#$%^&*()]]')
    })
  })
})
