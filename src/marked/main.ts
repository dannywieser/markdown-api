import { marked, TokenizerExtension } from 'marked'

import { highlightExtension, tagExtension } from './extensions'

export function lexer(markdownText: string, extensions: TokenizerExtension[] = []) {
  marked.use({
    extensions: [highlightExtension, tagExtension, ...extensions],
  })
  return marked.lexer(markdownText)
}
