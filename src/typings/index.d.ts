interface LoggerParams {
  type: 'info' | 'warn' | 'error' | 'debug' | 'success' | 'failure' | 'plain'
  message: string
  tag: string
  data?: any
  displayTime?: boolean
}
