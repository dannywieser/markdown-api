import { Database } from 'sqlite'

import { Config } from '../../../config'
import { MarkdownNote } from '../../../types'
import { convertDate } from '../../../util'
import { BearNote } from './bear.types'

const selfUrl = (noteId: string, { apiRoot, host, port }: Config) =>
  `http://${host}:${port}${apiRoot}/notes/${noteId}`
const bearUrl = (noteId: string, { bearConfig: { openInBearUrl } }: Config) =>
  `${openInBearUrl}${noteId}`
const webUrl = (noteId: string, { noteWebPath }: Config) => `${noteWebPath}/${noteId}`

export async function processNotes(db: Database, config: Config): Promise<MarkdownNote[]> {
  const rawNotes: BearNote[] = await db.all(`SELECT * FROM ZSFNOTE where ZTRASHED=0`)

  return rawNotes.map(
    ({
      Z_PK: primaryKey,
      ZCREATIONDATE,
      ZMODIFICATIONDATE,
      ZTEXT,
      ZTITLE,
      ZUNIQUEIDENTIFIER: id,
    }) => ({
      created: convertDate(ZCREATIONDATE),
      externalUrl: bearUrl(id, config),
      id,
      modified: convertDate(ZMODIFICATIONDATE),
      noteUrl: webUrl(id, config),
      primaryKey,
      self: selfUrl(id, config),
      source: 'bear',
      text: ZTEXT,
      title: ZTITLE,
    })
  )
}
