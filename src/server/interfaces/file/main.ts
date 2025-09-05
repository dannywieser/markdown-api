import path from 'path'

import { loadConfig } from '@/config'
import { lexer } from '@/marked/main'
import { readFile } from '@/util'

import { MarkdownInit, MarkdownNote } from '../interfaces.types'
import { noteCache } from './noteCache'

const {
  fileConfig: { directory },
} = loadConfig()

export async function init(): Promise<MarkdownInit> {
  const allNotes = await noteCache(directory)
  return { allNotes }
}

export async function noteById(
  fileName: string,
  { allNotes = [] }: MarkdownInit
): Promise<MarkdownNote | null> {
  const note = allNotes.find(({ id }) => id === fileName)
  if (note) {
    const text = await readFile(path.join(directory, `${fileName}.md`))
    return { ...note, tokens: lexer(text ?? '', allNotes) }
  } else {
    return null
  }
}
