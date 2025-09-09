import { TokensList } from 'marked'

export interface MarkdownNote {
  created: Date
  externalUrl: string
  id: string
  modified: Date
  noteUrl?: string
  self: string
  source: MarkdownNoteSource
  sourceFile?: string
  text?: string
  title: string
  tokens?: TokensList
}

export type MarkdownNoteSource = 'bear'
