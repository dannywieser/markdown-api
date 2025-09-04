import { marked } from 'marked'

import { mockMarkdownNote } from '@/testing-support'

import { highlightExtension, tagExtension } from './extensions'
import { makeWikilinkExtension } from './extensions/wikilink'
import { lexer } from './main'

jest.mock('marked', () => ({
  marked: {
    lexer: jest.fn(() => ['token1', 'token2']),
    use: jest.fn(),
  },
}))

jest.mock('./extensions/highlight', () => ({
  highlightExtension: { name: 'highlight' },
}))
jest.mock('./extensions/tag', () => ({
  tagExtension: { name: 'tag' },
}))
jest.mock('./extensions/wikilink', () => ({
  makeWikilinkExtension: jest.fn().mockReturnValue({ name: 'wikilink' }),
}))

const notes = [mockMarkdownNote('a'), mockMarkdownNote('b')]

describe('lexer', () => {
  test('calls marked.use with highlight, tag, and wikilink extensions', () => {
    lexer('some markdown', notes)
    expect(makeWikilinkExtension).toHaveBeenCalledWith(notes)
    expect(marked.use).toHaveBeenCalledWith({
      extensions: [highlightExtension, tagExtension, { name: 'wikilink' }],
    })
  })

  test('returns tokens from marked.lexer', () => {
    const result = lexer('some markdown', notes)
    expect(marked.lexer).toHaveBeenCalledWith('some markdown')
    expect(result).toEqual(['token1', 'token2'])
  })
})
