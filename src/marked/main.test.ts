import { marked, TokenizerExtension } from 'marked'

import { highlightExtension, tagExtension } from './extensions'
import { lexer } from './main'

jest.mock('marked', () => ({
  marked: {
    lexer: jest.fn(() => ['token1', 'token2']),
    use: jest.fn(),
  },
}))

jest.mock('./extensions', () => ({
  highlightExtension: { name: 'highlight' },
  tagExtension: { name: 'tag' },
}))

describe('lexer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls marked.use with default extensions', () => {
    lexer('some markdown')
    expect(marked.use).toHaveBeenCalledWith({
      extensions: [highlightExtension, tagExtension],
    })
  })

  test('calls marked.use with additional extensions', () => {
    const extraExtension = { name: 'extra' } as unknown as TokenizerExtension
    lexer('some markdown', [extraExtension])
    expect(marked.use).toHaveBeenCalledWith({
      extensions: [highlightExtension, tagExtension, extraExtension],
    })
  })

  test('returns tokens from marked.lexer', () => {
    const result = lexer('some markdown')
    expect(marked.lexer).toHaveBeenCalledWith('some markdown')
    expect(result).toEqual(['token1', 'token2'])
  })
})
