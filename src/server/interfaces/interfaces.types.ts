import { TokensList } from 'marked'
export interface CustomTokensList extends TokensList {
  foo?: string
}

export interface MarkdownInit {
  allNotes?: MarkdownNote[]
}

export interface MarkdownInterfaceMode {
  init: () => Promise<MarkdownInit>
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

export type MarkdownNoteSource = 'bear' | 'file'
