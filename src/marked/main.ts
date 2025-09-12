import { marked } from 'marked'

import { MarkdownNote, MarkdownNoteFile } from '../types'
import { highlightExtension, tagExtension } from './extensions'
import { makeBearImagesExtension } from './extensions/bearImages'
import { makeWikilinkExtension } from './extensions/wikilink'

export function lexer(markdownText: string, allNotes: MarkdownNote[], files: MarkdownNoteFile[]) {
  const wikilinksExtension = makeWikilinkExtension(allNotes)
  const bearImagesExtension = makeBearImagesExtension(files)
  marked.use({
    extensions: [bearImagesExtension, highlightExtension, tagExtension, wikilinksExtension],
  })
  return marked.lexer(markdownText)
}
