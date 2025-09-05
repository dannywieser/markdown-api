import { marked } from 'marked'

import { MarkdownNote } from '../server/interfaces/interfaces.types'
import { highlightExtension, tagExtension } from './extensions'
import { makeWikilinkExtension } from './extensions/wikilink'

export function lexer(markdownText: string, allNotes: MarkdownNote[]) {
  const wikilinksExtension = makeWikilinkExtension(allNotes)
  marked.use({
    extensions: [highlightExtension, tagExtension, wikilinksExtension],
  })
  return marked.lexer(markdownText)
}
