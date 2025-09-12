import { Config } from '../../../config'
import { lexer } from '../../../marked/main'
import { MarkdownNote } from '../../../types'
import { MarkdownInit } from '../interfaces.types'
import { backupBearDatabase, loadDatabase } from './database'
import { processNotes } from './mapNote'

export async function allNotes(
  _params: unknown,
  { allNotes = [] }: MarkdownInit
): Promise<MarkdownNote[]> {
  return allNotes
}

export async function init(config: Config): Promise<MarkdownInit> {
  const backupFile = backupBearDatabase(config)
  if (!backupFile) {
    throw new Error('unable to backup bear database')
  }
  const db = await loadDatabase(backupFile)
  const allNotes = await processNotes(db, config)
  return { allNotes, config, db }
}

export async function noteById(
  findNoteId: string,
  init: MarkdownInit
): Promise<MarkdownNote | null> {
  const { allNotes = [] } = init
  const note = allNotes.find(({ id }) => id === findNoteId)
  return note
    ? {
        ...note,
        tokens: lexer(note.text ?? '', allNotes, note.files),
      }
    : null
}
