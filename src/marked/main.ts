import { marked } from 'marked'

import { highlightExtension, tagExtension } from './extensions'

export function lexer(markdownText: string) {
  marked.use({
    extensions: [highlightExtension, tagExtension],
  })
  return marked.lexer(markdownText)
}
