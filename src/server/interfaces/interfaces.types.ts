import { Database } from 'sqlite'

export interface MarkdownInit {
  db?: Database
}

export interface MarkdownInterfaceMode {
  init: () => Promise<MarkdownInit>
  noteById: (noteId: string, init: MarkdownInit) => Promise<NoteResponse | null>
}

export interface NoteResponse {
  note: string
}
