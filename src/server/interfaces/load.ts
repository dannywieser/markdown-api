import { loadConfig } from '../../config'
import * as bearMod from './bear/main'
import * as fileMod from './file/main'
import { MarkdownInterfaceMode } from './interfaces.types'

export function loadInterface(): MarkdownInterfaceMode {
  const { mode } = loadConfig()
  if (mode === 'bear') {
    return bearMod
  }
  if (mode === 'file') {
    return fileMod
  }
  throw new Error(`invalid mode: ${mode}`)
}
