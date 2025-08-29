import { TokenizerExtension } from 'marked'

const getColor = (emoji: string = '🟡') => {
  switch (emoji) {
    case '🔴':
      return 'red'
    case '🔵':
      return 'blue'
    case '🟡':
      return 'yellow'
    case '🟢':
      return 'green'
    case '🟣':
      return 'purple'
    default:
      return 'yellow'
  }
}

export const highlightExtension: TokenizerExtension = {
  level: 'inline',
  name: 'Bear Highlight',
  start(src: string) {
    return src.match(/==([\p{Emoji}])([^\p{Emoji}=]+)==/u)?.index
  },
  tokenizer(src: string) {
    const rule = /==([\p{Emoji}])([^\p{Emoji}=]+)==/u
    const match = rule.exec(src)
    if (match) {
      return {
        color: getColor(match[1]),
        raw: match[0],
        text: match[2],
        type: 'highlight',
      }
    }
  },
}
