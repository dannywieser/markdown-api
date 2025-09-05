import { TokenizerExtension } from 'marked'

const rule = /#([^\s#]+)/
export const start = (src: string) => src.match(rule)?.index
export const tokenizer = (src: string) => {
  const match = rule.exec(src)
  if (match) {
    return {
      raw: match[0],
      text: match[1],
      type: 'hashtag',
    }
  }
}

export const tagExtension: TokenizerExtension = {
  level: 'inline',
  name: 'hashtag',
  start,
  tokenizer,
}
