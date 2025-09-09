import { TokensList } from 'marked'

export interface MarkdownNote {
  created: Date
  id: string
  modified: Date
  noteUrl?: string
  source: MarkdownNoteSource
  sourceFile?: string
  text?: string
  title: string
  tokens?: TokensList
}

export type MarkdownNoteSource = 'bear'
