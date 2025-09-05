import fs from 'fs/promises'
import path from 'path'

import { MarkdownNote, MarkdownNoteSource } from '../interfaces.types'

const source = 'file' as MarkdownNoteSource

const makeNoteUrl = (noteId: string) => `/note/${noteId}`
export async function noteCache(rootDir: string): Promise<MarkdownNote[]> {
  const files = await fs.readdir(rootDir)
  const notes = await Promise.all(
    files.map(async (sourceFile) => {
      const filePath = path.join(rootDir, sourceFile)
      const stats = await fs.stat(filePath)
      const title = path.basename(sourceFile, '.md')
      return {
        created: stats.birthtime,
        id: title,
        modified: stats.mtime,
        noteUrl: makeNoteUrl(title),
        source,
        sourceFile,
        title: title,
      }
    })
  )
  return notes
}
