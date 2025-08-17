import { describe, expect, it } from 'vitest'
import { Logger, StreamLogger } from '../src'
import { logger } from '../src/index'

describe('stream logger', () => {
  it('create stream logger via new StreamLogger', async () => {
    const streamLogger1 = new StreamLogger('❤️ streamLogger1', ['underline'])
    streamLogger1.text('create via new StreamLogger', ['gray']).update()
  })

  it('create stream logger via Logger.toStream', async () => {
    const streamLogger2 = new Logger().toStream('❤️ streamLogger2', [
      'underline',
    ])
    streamLogger2.text('create via Logger.toStream', ['gray']).update()
  })

  it('create stream logger via logger.stream', async () => {
    const streamLogger3 = logger.stream
    streamLogger3
      .prefix('❤️ streamLogger3', ['underline'])
      .text('create via logger.stream', ['gray'])
      .update()
  })

  it('should include prefix in stream logger output', () => {
    const stream = logger.stream
      .prefix('📦 INSTALL')
      .text('Installing packages...')

    const output = stream.toString()
    expect(output).toContain('📦 INSTALL')
    expect(output).toContain('Installing packages...')

    // Test that prefix persists after text updates
    stream.text('Downloading dependencies...')
    const updatedOutput = stream.toString()
    expect(updatedOutput).toContain('📦 INSTALL')
    expect(updatedOutput).toContain('Downloading dependencies...')
  })

  it('should include styled prefix in stream logger output', () => {
    const stream = logger.stream
      .prefix('🔄 PROCESS', ['cyan', 'bold'])
      .text('Processing data...')

    const output = stream.toString()
    expect(output).toContain('🔄 PROCESS')
    expect(output).toContain('Processing data...')
  })
})
