import * as bearMod from './bear/main'
import * as fileMod from './file/main'
import { MarkdownInterfaceMode, MarkdownNoteSource } from './interfaces.types'

export function loadInterface(mode: MarkdownNoteSource): MarkdownInterfaceMode {
  if (mode === 'bear') {
    return bearMod
  }
  if (mode === 'obsidian') {
    return fileMod
  }
  throw new Error(`invalid mode: ${mode}`)
}
