import { TokensList } from 'marked'

import { lexer } from '../../../marked/main'
import { asMock, mockConfig, mockMarkdownNote } from '../../../testing-support'
import { readFile } from '../../../util'
import { init, noteById } from './main'
import { noteCache } from './noteCache'

jest.mock('marked', () => ({
  marked: {
    lexer: jest.fn(() => ['token1', 'token2']),
    use: jest.fn(),
  },
}))
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
}))
jest.mock('./noteCache')
jest.mock('../../../marked/main')
jest.mock('../../../util')

describe('file interface functions', () => {
  test('init retrieves basic information about all notes', async () => {
    const notes = [mockMarkdownNote('a'), mockMarkdownNote('b')]
    asMock(noteCache).mockResolvedValue(notes)
    const config = mockConfig({ mode: 'obsidian' })

    const result = await init(config)

    expect(result).toEqual({ allNotes: notes, config })
  })
  test('noteById reads file content and tokenizes it if a match is found', async () => {
    const allNotes = [mockMarkdownNote('abc'), mockMarkdownNote('def')]
    const tokens = ['token'] as unknown as TokensList
    asMock(lexer).mockReturnValue(tokens)
    asMock(readFile).mockResolvedValue('readFile result')
    const config = mockConfig({ mode: 'obsidian' })

    const result = await noteById('abc', { allNotes, config })

    expect(readFile).toHaveBeenCalledWith('/path/to/files/abc.md')
    expect(result).toEqual({
      ...allNotes[0],
      tokens: tokens,
    })
    expect(lexer).toHaveBeenCalledWith('readFile result', allNotes)
  })
  test('noteById returns null when note not found', async () => {
    const allNotes = [mockMarkdownNote('abc'), mockMarkdownNote('efg')]
    const config = mockConfig({ mode: 'obsidian' })

    const result = await noteById('def', { allNotes, config })

    expect(result).toBeNull()
  })
})
