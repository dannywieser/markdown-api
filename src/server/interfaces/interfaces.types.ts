import { TokensList } from 'marked'

import { Config } from '../../config'
export interface CustomTokensList extends TokensList {
  foo?: string
}

export interface MarkdownInit {
  allNotes?: MarkdownNote[]
  config: Config
}

export interface MarkdownInterfaceMode {
  init: (config: Config) => Promise<MarkdownInit>
  noteById: (noteId: string, init: MarkdownInit) => Promise<MarkdownNote | null>
}

export interface MarkdownNote {
  created: Date
  id: string
  modified: Date
  noteUrl?: string
  source: MarkdownNoteSource
  sourceFile?: string
  text?: string
  title: string
  tokens?: CustomTokensList
}

export type MarkdownNoteSource = 'bear'
