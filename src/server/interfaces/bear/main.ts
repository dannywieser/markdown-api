import { lexer as markdownLexer } from 'marked'

import { convertDate } from '@/util'

import { MarkdownInit, MarkdownNote } from '../interfaces.types'
import { backupBearDatabase, loadDatabase } from './database'

export async function init(): Promise<MarkdownInit> {
  const backupFile = backupBearDatabase()
  const db = await loadDatabase(backupFile)
  return { db }
}

export async function noteById(
  noteId: string,
  { db = undefined }: MarkdownInit
): Promise<MarkdownNote | null> {
  if (!db) {
    throw new Error('database not ready')
  }
  const result = await db.get(
    `SELECT ZTEXT, ZMODIFICATIONDATE, ZCREATIONDATE  FROM ZSFNOTE where ZUNIQUEIDENTIFIER=?`,
    [noteId]
  )

  const {
    ZCREATIONDATE: creationDate,
    ZMODIFICATIONDATE: modificationDate,
    ZTEXT: noteText = '',
  } = result
  const tokens = markdownLexer(noteText)

  return {
    created: convertDate(creationDate),
    id: noteId,
    modified: convertDate(modificationDate),
    source: 'bear',
    tokens,
  }
}
