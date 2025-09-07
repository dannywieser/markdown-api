import path from 'path'

import { Config } from '../../../config'
import { lexer } from '../../../marked/main'
import { readFile } from '../../../util'
import { MarkdownInit, MarkdownNote } from '../interfaces.types'
import { noteCache } from './noteCache'

export async function init(config: Config): Promise<MarkdownInit> {
  const { fileConfig } = config
  const directory = fileConfig?.directory ?? '~'
  const allNotes = await noteCache(directory)
  return { allNotes, config }
}

export async function noteById(
  fileName: string,
  { allNotes = [], config }: MarkdownInit
): Promise<MarkdownNote | null> {
  // TODO: better typing!
  const directory = config.fileConfig?.directory ?? '~'
  const note = allNotes.find(({ id }) => id === fileName)
  if (note) {
    const text = await readFile(path.join(directory, `${fileName}.md`))
    return { ...note, tokens: lexer(text ?? '', allNotes) }
  } else {
    return null
  }
}
