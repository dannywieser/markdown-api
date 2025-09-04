import { TokensList } from 'marked'
import { Database } from 'sqlite'

import { lexer } from '@/marked/main'
import { asMock, mockMarkdownNote } from '@/testing-support'

import { backupBearDatabase, loadDatabase } from './database'
import { init, noteById } from './main'
import { noteCache } from './noteCache'

jest.mock('marked', () => ({
  marked: {
    lexer: jest.fn(() => ['token1', 'token2']),
    use: jest.fn(),
  },
}))
jest.mock('./database')
jest.mock('./noteCache')
jest.mock('@/marked/main')

describe('bear interface functions', () => {
  test('init backs up the database, loads it, and returns allNotes', async () => {
    asMock(backupBearDatabase).mockReturnValue('backup.sqlite')
    const mockDb = {} as Database
    asMock(loadDatabase).mockResolvedValue(mockDb)
    const notes = [mockMarkdownNote('a'), mockMarkdownNote('b')]
    asMock(noteCache).mockResolvedValue(notes)

    const result = await init()
    expect(backupBearDatabase).toHaveBeenCalled()
    expect(loadDatabase).toHaveBeenCalledWith('backup.sqlite')
    expect(noteCache).toHaveBeenCalledWith(mockDb)
    expect(result).toEqual({ allNotes: notes })
  })

  test('noteById returns note with tokens when found', async () => {
    const allNotes = [mockMarkdownNote('abc'), mockMarkdownNote('def')]
    const tokens = ['token'] as unknown as TokensList
    asMock(lexer).mockReturnValue(tokens)

    const result = await noteById('abc', { allNotes })
    expect(result).toEqual({
      ...allNotes[0],
      tokens: tokens,
    })
    expect(lexer).toHaveBeenCalledWith('abc', allNotes)
  })

  test('noteById returns null when note not found', async () => {
    const allNotes = [mockMarkdownNote('abc'), mockMarkdownNote('efg')]
    const result = await noteById('def', { allNotes })
    expect(result).toBeNull()
  })
})
