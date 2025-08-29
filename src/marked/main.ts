import { marked } from 'marked'

import { highlightExtension } from './extensions/highlight'

export function lexer(markdownText: string) {
  marked.use({
    extensions: [highlightExtension],
  })
  return marked.lexer(markdownText)
}
