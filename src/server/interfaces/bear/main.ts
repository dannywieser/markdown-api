import { lexer } from '@/marked/main'

import { MarkdownInit, MarkdownNote } from '../interfaces.types'
import { backupBearDatabase, loadDatabase } from './database'
import { noteCache } from './noteCache'

export async function init(): Promise<MarkdownInit> {
  const backupFile = backupBearDatabase()
  const db = await loadDatabase(backupFile)
  const allNotes = await noteCache(db)
  return { allNotes }
}

export async function noteById(
  findNoteId: string,
  { allNotes = [] }: MarkdownInit
): Promise<MarkdownNote | null> {
  const note = allNotes.find(({ id }) => id === findNoteId)
  return note
    ? {
        ...note,
        tokens: lexer(note.text ?? '', allNotes),
      }
    : null
}
