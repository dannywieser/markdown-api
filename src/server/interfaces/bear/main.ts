import { MarkdownInit, NoteResponse } from '../interfaces.types'
import { backupBearDatabase, loadDatabase } from './database'

export async function init(): Promise<MarkdownInit> {
  const backupFile = backupBearDatabase()
  const db = await loadDatabase(backupFile)
  return { db }
}

export async function noteById(
  noteId: string,
  { db = undefined }: MarkdownInit
): Promise<NoteResponse | null> {
  if (!db) {
    throw new Error('database not ready')
  }
  const result = await db.get(
    `SELECT ZTEXT FROM ZSFNOTE where ZUNIQUEIDENTIFIER=?`,
    [noteId]
  )
  return result ? { note: result.ZTEXT } : null
}
