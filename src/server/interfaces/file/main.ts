import path from 'path'

import { loadConfig } from '@/config'
import { readFile } from '@/util'

import { MarkdownInit, MarkdownNote } from '../interfaces.types'

export async function init(): Promise<MarkdownInit> {
  return {} // no init required for file mode
}

export async function noteById(
  fileName: string,
  _init: MarkdownInit
): Promise<MarkdownNote | null> {
  const {
    fileConfig: { directory },
  } = loadConfig()

  const note = await readFile(path.join(directory, `${fileName}.md`))

  // TODO: file mode with create / modified date
  return note ? ({} as unknown as MarkdownNote) : null
}
