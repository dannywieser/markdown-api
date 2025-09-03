import { Database } from 'sqlite'

import makeWikilinkExtension from '@/marked/extensions/wikilink'
import { lexer } from '@/marked/main'
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
  findNoteId: string,
  { db = undefined }: MarkdownInit
): Promise<MarkdownNote | null> {
  if (!db) {
    throw new Error('database not ready')
  }
  // TODO: this should be cached and only do DB queries if there is a change
  const cache = await noteCache(db)
  const note = cache.find(({ id }) => id === findNoteId)
  if (note) {
    const wikilinksExtension = makeWikilinkExtension(cache)
    return {
      ...note,
      tokens: lexer(note.text, [wikilinksExtension]),
    }
  } else {
    return null
  }
}

async function noteCache(db: Database): Promise<MarkdownNote[]> {
  const rawNotes: BearNote[] = await db.all(`SELECT * FROM ZSFNOTE`)
  return rawNotes.map(({ ZCREATIONDATE, ZMODIFICATIONDATE, ZTEXT, ZTITLE, ZUNIQUEIDENTIFIER }) => ({
    created: convertDate(ZCREATIONDATE),
    id: ZUNIQUEIDENTIFIER,
    modified: convertDate(ZMODIFICATIONDATE),
    noteUrl: `/note/${ZUNIQUEIDENTIFIER}`,
    source: 'bear',
    text: ZTEXT,
    title: ZTITLE,
  }))
}
