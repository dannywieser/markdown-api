import { lexer } from '@/marked/main'
import { convertDate } from '@/util'

import { MarkdownInit, MarkdownNote } from '../interfaces.types'
import handleWikiLinks from './bear.util'
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

  if (!result) {
    return result
  }

  const {
    ZCREATIONDATE: creationDate,
    ZMODIFICATIONDATE: modificationDate,
    ZTEXT: noteText = '',
  } = result

  const noteTextWithWikiLinks = await handleWikiLinks(noteText, db)

  return {
    created: convertDate(creationDate),
    id: noteId,
    modified: convertDate(modificationDate),
    source: 'bear',
    tokens: lexer(noteTextWithWikiLinks),
  }
}
