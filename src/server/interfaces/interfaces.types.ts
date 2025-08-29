import { TokensList } from 'marked'
import { Database } from 'sqlite'

export interface CustomTokensList extends TokensList {
  foo?: string
}

export interface MarkdownInit {
  db?: Database
}

export interface MarkdownInterfaceMode {
  init: () => Promise<MarkdownInit>
  noteById: (noteId: string, init: MarkdownInit) => Promise<MarkdownNote | null>
}

export interface MarkdownNote {
  created: Date
  id: string
  modified: Date
  source: MarkdownNoteSource
  tokens: CustomTokensList
}

export type MarkdownNoteSource = 'bear' | 'file'
