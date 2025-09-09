import { MarkdownNoteSource } from '../../types'
import * as bearMod from './bear/main'
import { MarkdownInterfaceMode } from './interfaces.types'

export function loadInterface(mode: MarkdownNoteSource): MarkdownInterfaceMode {
  if (mode === 'bear') {
    return bearMod
  }
  throw new Error(`invalid mode: ${mode}`)
}
