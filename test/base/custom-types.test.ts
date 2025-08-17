import { describe, expect, it } from 'vitest'
import type { Logger as LoggerType } from '../../src'
import { createLogger, logger } from '../../src/index'
import type { Type } from '../../src/typings'

describe('custom Logger Types - Base Functionality', () => {
  describe('adding Custom Types', () => {
    it('should add custom logger type via type function', () => {
      const customLoggerType = 'test'

      // Ensure the custom type does not exist before adding
      expect(Reflect.ownKeys(logger.stylesMap)).not.toContain(customLoggerType)

      // Add a custom logger type
      logger.type(customLoggerType, ['bgGreenBright', 'underline'])

      // Verify the custom type was added
      expect(Reflect.ownKeys(logger.stylesMap)).toContain(customLoggerType)

      // Use the custom logger type
      const result = logger
        .type(customLoggerType)
        .prefix('custom logger')
        .text('test adding custom logger type via type function')
        .appendDivider('*')
        .toString()

      expect(result).toContain('custom logger')
      expect(result).toContain('test adding custom logger type via type function')
    })

    it('should add custom logger type via proxy', () => {
      const customLogger = createLogger<{
        newType: Type.CreateCustomType
      }>()

      // Ensure the custom type does not exist before adding
      expect(Reflect.ownKeys(customLogger)).not.toContain('newType')

      // Add and use the custom logger type via proxy
      const result1 = customLogger
        .newType(['bgRedBright', 'underline'])
        .prefix('custom logger')
        .text('test adding custom logger type via proxy function')
        .toString()

      expect(result1).toContain('custom logger')
      expect(result1).toContain('test adding custom logger type via proxy function')

      // Use the type function to add and use the custom logger type
      const result2 = customLogger
        .type('newType')
        .prefix('custom logger')
        .text('The next time you can use newType with type function')
        .toString()

      expect(result2).toContain('custom logger')
      expect(result2).toContain('The next time you can use newType with type function')

      // Verify the custom type was added
      expect(Reflect.ownKeys(customLogger)).toContain('newType')
    })

    it('should allow direct usage of custom type (not recommended)', () => {
      const customLogger = createLogger<{
        directType: Type.CreateCustomType
      }>()

      // Add custom type via proxy
      customLogger.directType(['bgMagenta', 'bold'])

      // Direct usage (not recommended but should work)
      const customLoggerType = customLogger.directType as unknown as LoggerType
      const result = customLoggerType
        .prefix('direct usage')
        .text('Direct usage of custom type')
        .toString()

      expect(result).toContain('direct usage')
      expect(result).toContain('Direct usage of custom type')
    })
  })

  describe('overriding Preset Types', () => {
    it('should override preset logger type', () => {
      const originalInfoStyles = logger.stylesMap.info
      const newStyles: (typeof logger.stylesMap)['info'] = ['bgYellow']

      // Override the 'info' logger type with new styles
      logger.type('info', newStyles)

      // Verify the styles were updated
      expect(logger.stylesMap.info).toBe(newStyles)
      expect(logger.stylesMap.info).not.toBe(originalInfoStyles)

      // Use the overridden logger type
      const result = logger.info
        .prefix('info')
        .text('test overriding preset logger type')
        .prependDivider()
        .toString()

      expect(result).toContain('info')
      expect(result).toContain('test overriding preset logger type')

      // Restore original styles for other tests
      logger.type('info', originalInfoStyles)
    })

    it('should maintain type consistency after override', () => {
      const originalStyles = logger.stylesMap.warn
      const newStyles = ['bgCyan', 'black']

      // Override warn type
      logger.type('warn', newStyles)
      expect(logger.stylesMap.warn).toEqual(newStyles)

      // Create new instance and verify it uses new styles
      const warnLogger = logger.warn
      expect(warnLogger).toBeDefined()

      // Restore original
      logger.type('warn', originalStyles)
      expect(logger.stylesMap.warn).toEqual(originalStyles)
    })
  })

  describe('type System Integration', () => {
    it('should work with TypeScript type system', () => {
      interface CustomTypes {
        apiCall: Type.CreateCustomType
        database: Type.CreateCustomType
        cache: Type.CreateCustomType
      }

      const typedLogger = createLogger<CustomTypes>()

      // Should not throw TypeScript errors
      const apiResult = typedLogger
        .apiCall(['bgBlue', 'white'])
        .prefix('API')
        .text('Making API call')
        .toString()

      const dbResult = typedLogger
        .database(['bgGreen', 'white'])
        .prefix('DB')
        .text('Database query')
        .toString()

      const cacheResult = typedLogger
        .cache(['bgYellow', 'black'])
        .prefix('CACHE')
        .text('Cache operation')
        .toString()

      expect(apiResult).toContain('API')
      expect(dbResult).toContain('DB')
      expect(cacheResult).toContain('CACHE')
    })

    it('should handle multiple custom types in single logger', () => {
      const multiLogger = createLogger<{
        type1: Type.CreateCustomType
        type2: Type.CreateCustomType
        type3: Type.CreateCustomType
      }>()

      // Add multiple types
      multiLogger.type1(['red'])
      multiLogger.type2(['green'])
      multiLogger.type3(['blue'])

      // Verify all types are available
      expect(Reflect.ownKeys(multiLogger)).toContain('type1')
      expect(Reflect.ownKeys(multiLogger)).toContain('type2')
      expect(Reflect.ownKeys(multiLogger)).toContain('type3')

      // Use all types
      const results = [
        multiLogger.type1.text('Type 1 message').toString(),
        multiLogger.type2.text('Type 2 message').toString(),
        multiLogger.type3.text('Type 3 message').toString(),
      ]

      results.forEach((result, index) => {
        expect(result).toContain(`Type ${index + 1} message`)
      })
    })
  })

  describe('edge Cases', () => {
    it('should handle empty style arrays', () => {
      expect(() => {
        logger.type('emptyStyles', [])
        logger.type('emptyStyles').text('Empty styles test').toString()
      }).not.toThrow()
    })

    it('should handle invalid style names gracefully', () => {
      expect(() => {
        logger.type('invalidStyles', ['nonExistentStyle' as any])
        logger.type('invalidStyles').text('Invalid styles test').toString()
      }).not.toThrow()
    })

    it('should handle duplicate type registration', () => {
      const typeName = 'duplicateType'
      const styles1 = ['red']
      const styles2 = ['blue']

      // Register first time
      logger.type(typeName, styles1)
      expect(logger.stylesMap[typeName]).toEqual(styles1)

      // Register again with different styles
      logger.type(typeName, styles2)
      expect(logger.stylesMap[typeName]).toEqual(styles2)
    })

    it('should handle very long type names', () => {
      const longTypeName = 'a'.repeat(100)
      expect(() => {
        logger.type(longTypeName, ['green'])
        logger.type(longTypeName).text('Long type name test').toString()
      }).not.toThrow()
    })
  })
})
