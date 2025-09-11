import { marked } from 'marked'

import { MarkdownNote } from '../types'
import { highlightExtension, tagExtension } from './extensions'
import { makeWikilinkExtension } from './extensions/wikilink'

export function lexer(markdownText: string, allNotes: MarkdownNote[]) {
  const wikilinksExtension = makeWikilinkExtension(allNotes)
  // TODO: need a new extension here which will add the correct path to the images in bear.
  marked.use({
    extensions: [highlightExtension, tagExtension, wikilinksExtension],
  })
  return marked.lexer(markdownText)
}
