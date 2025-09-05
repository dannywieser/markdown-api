import { TokenizerExtension } from 'marked'

import { MarkdownNote } from '@/server/interfaces/interfaces.types'

export function makeWikilinkExtension(noteCache: MarkdownNote[]): TokenizerExtension {
  const rule = /\[\[(.+?)\]\]/u
  const start = (src: string) => src.match(rule)?.index
  const tokenizer = (src: string) => {
    const match = rule.exec(src)
    if (match) {
      const linkTitle = match[1]
      const targetNote = noteCache.find(({ title: noteTitle }) => linkTitle === noteTitle)
      const href = targetNote ? targetNote.noteUrl : 'invalid'
      return {
        href,
        raw: match[0],
        text: match[1],
        type: 'wikilink',
      }
    }
  }

  return {
    level: 'inline',
    name: 'wikilink',
    start,
    tokenizer,
  }
}
