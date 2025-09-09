import { Database } from 'sqlite'

import { MarkdownNote } from '../../../types'
import { convertDate } from '../../../util'
import { BearNote } from './bear.types'

const makeNoteUrl = (noteId: string) => `/note/${noteId}`
export async function noteCache(db: Database): Promise<MarkdownNote[]> {
  const rawNotes: BearNote[] = await db.all(`SELECT * FROM ZSFNOTE where ZTRASHED=0`)
  return rawNotes.map(({ ZCREATIONDATE, ZMODIFICATIONDATE, ZTEXT, ZTITLE, ZUNIQUEIDENTIFIER }) => ({
    created: convertDate(ZCREATIONDATE),
    id: ZUNIQUEIDENTIFIER,
    modified: convertDate(ZMODIFICATIONDATE),
    noteUrl: makeNoteUrl(ZUNIQUEIDENTIFIER),
    source: 'bear',
    text: ZTEXT,
    title: ZTITLE,
  }))
}
