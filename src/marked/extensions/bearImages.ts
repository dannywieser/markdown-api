import { TokenizerExtension } from 'marked'

import { MarkdownNoteFile } from '../../types'

export function makeBearImagesExtension(images: MarkdownNoteFile[]): TokenizerExtension {
  const rule = /^!\[\]\(([^)]+)\)/u
  const tokenizer = (src: string) => {
    const match = rule.exec(src)
    if (match) {
      const linkedFile = match[1] ? decodeURIComponent(match[1]) : ''
      const targetFile = images.find(({ file }) => file === linkedFile)
      const href = targetFile ? encodeURI(targetFile.path) : 'invalid'
      return {
        href,
        raw: match[0],
        type: 'image',
      }
    }
  }

  return {
    level: 'inline',
    name: 'image',
    tokenizer,
  }
}
