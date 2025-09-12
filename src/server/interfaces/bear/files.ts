import { MarkdownNote } from '../../../types'
import { MarkdownInit } from '../interfaces.types'
import { BearRawFile } from './bear.types'

export async function getFilesForNote({ primaryKey }: MarkdownNote, { config, db }: MarkdownInit) {
  const { imageRoot } = config
  const files = await db.all<BearRawFile[]>('SELECT * FROM ZSFNOTEFILE where ZNOTE=?', primaryKey)

  return files
    ? files.map(({ ZFILENAME, ZUNIQUEIDENTIFIER }) => ({
        directory: ZUNIQUEIDENTIFIER,
        file: ZFILENAME,
        path: `${imageRoot}/${ZUNIQUEIDENTIFIER}/${ZFILENAME}`,
      }))
    : []
}
