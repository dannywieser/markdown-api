import { Database } from 'sqlite'

import { Config } from '../../config'
import { MarkdownNote } from '../../types'

export interface MarkdownInit {
  allNotes?: MarkdownNote[]
  config: Config
  db: Database
}

export interface MarkdownInterfaceMode {
  allNotes: (params: unknown, init: MarkdownInit) => Promise<MarkdownNote[]>
  init: (config: Config) => Promise<MarkdownInit>
  noteById: (noteId: string, init: MarkdownInit) => Promise<MarkdownNote | null>
}
