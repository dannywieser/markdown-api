import { marked } from 'marked'
import { Database } from 'sqlite'

import { highlightExtension, tagExtension } from '@/marked/extensions'
import makeWikilinkExtension from '@/marked/extensions/wikilink'
import { convertDate } from '@/util'

import { MarkdownInit, MarkdownNote } from '../interfaces.types'
import { BearNote } from './bear.types'
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
    return null
  }

  const {
    ZCREATIONDATE: creationDate,
    ZMODIFICATIONDATE: modificationDate,
    ZTEXT: noteText = '',
  } = result

  const cache = await noteCache(db)
  const wikilinksExtension = makeWikilinkExtension(cache)
  marked.use({
    extensions: [highlightExtension, tagExtension, wikilinksExtension],
  })

  return {
    created: convertDate(creationDate),
    id: noteId,
    modified: convertDate(modificationDate),
    source: 'bear',
    tokens: marked.lexer(noteText),
  }
}

export async function noteCache(db: Database): Promise<MarkdownNote[]> {
  const rawNotes: BearNote[] = await db.all(`SELECT * FROM ZSFNOTE`)
  return rawNotes.map(({ ZCREATIONDATE, ZMODIFICATIONDATE, ZTEXT, ZTITLE, ZUNIQUEIDENTIFIER }) => ({
    created: convertDate(ZCREATIONDATE),
    id: ZUNIQUEIDENTIFIER,
    modified: convertDate(ZMODIFICATIONDATE),
    noteText: ZTEXT,
    noteUrl: `/note/${ZUNIQUEIDENTIFIER}`,
    source: 'bear',
    title: ZTITLE,
  }))
}
