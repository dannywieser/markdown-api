import { Database } from 'sqlite'

import { convertDate } from '../../../util'
import { MarkdownNote } from '../interfaces.types'
import { BearNote } from './bear.types'

const makeNoteUrl = (noteId: string) => `/note/${noteId}`
export async function noteCache(db: Database): Promise<MarkdownNote[]> {
  const rawNotes: BearNote[] = await db.all(`SELECT * FROM ZSFNOTE`)
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
