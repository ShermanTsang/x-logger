import type { ChalkInstance } from 'chalk'
import type { Logger } from '../core.ts'

export namespace Type {
  type PresetTypes =
    | 'info'
    | 'warn'
    | 'error'
    | 'debug'
    | 'success'
    | 'failure'
    | 'plain'
  type Type = PresetTypes | string | symbol

  type Style = keyof ChalkInstance

  type Styles = Style[]

  type CreateCustomType = (styles: LoggerStyles) => Logger

  type CustomTypes = Record<string, CreateCustomType>
}
