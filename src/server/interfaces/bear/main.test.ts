import { TokensList } from 'marked'
import { Database } from 'sqlite'

import { lexer } from '../../../marked/main'
import { asMock, mockConfig, mockMarkdownNote } from '../../../testing-support'
import { backupBearDatabase, loadDatabase } from './database'
import { getFilesForNote } from './files'
import { allNotes, init, noteById } from './main'
import { processNotes } from './processNotes'

jest.mock('marked', () => ({
  marked: {
    lexer: jest.fn(() => ['token1', 'token2']),
    use: jest.fn(),
  },
}))
jest.mock('./files')
jest.mock('./database')
jest.mock('./processNotes')
jest.mock('../../../marked/main')

const db = {} as Database
beforeEach(() => {
  asMock(getFilesForNote).mockResolvedValue([])
})

describe('bear interface functions', () => {
  test('init backs up the database, loads it, and returns allNotes', async () => {
    asMock(backupBearDatabase).mockReturnValue('backup.sqlite')

    asMock(loadDatabase).mockResolvedValue(db)
    const notes = [mockMarkdownNote({ id: 'a' }), mockMarkdownNote({ id: 'b' })]
    asMock(processNotes).mockResolvedValue(notes)
    const config = mockConfig({ mode: 'bear' })

    const result = await init(config)

    expect(backupBearDatabase).toHaveBeenCalled()
    expect(loadDatabase).toHaveBeenCalledWith('backup.sqlite')
    expect(processNotes).toHaveBeenCalledWith(db, config)
    expect(result).toEqual({ allNotes: notes, config, db })
  })

  test('noteById returns note with tokens when found', async () => {
    const allNotes = [mockMarkdownNote({ id: 'abc' }), mockMarkdownNote({ id: 'def' })]
    const tokens = ['token'] as unknown as TokensList
    asMock(lexer).mockReturnValue(tokens)
    const config = mockConfig({ mode: 'bear' })

    const result = await noteById('abc', { allNotes, config, db })

    expect(result).toEqual({
      ...allNotes[0],
      files: [],
      tokens: tokens,
    })
    expect(lexer).toHaveBeenCalledWith('note text', allNotes)
  })

  test('files returned by getFilesForNote are included in the response', async () => {
    const allNotes = [
      mockMarkdownNote({ id: 'abc', primaryKey: 123 }),
      mockMarkdownNote({ id: 'def' }),
    ]
    const tokens = ['token'] as unknown as TokensList
    asMock(lexer).mockReturnValue(tokens)
    const config = mockConfig({ mode: 'bear' })
    const files = [
      { directory: 'a', file: 'a', path: 'a' },
      { directory: 'b', file: 'b', path: 'b' },
    ]
    asMock(getFilesForNote).mockResolvedValue(files)

    const init = { allNotes, config, db }
    const result = await noteById('def', init)

    expect(result?.files).toEqual(files)
    expect(getFilesForNote).toHaveBeenCalledWith(allNotes[1], init)
  })

  test('noteById returns null when note not found', async () => {
    const allNotes = [mockMarkdownNote({ id: 'abc' }), mockMarkdownNote({ id: 'efg' })]
    const config = mockConfig({ mode: 'bear' })

    const result = await noteById('def', { allNotes, config, db })

    expect(result).toBeNull()
  })

  test('allNotes returns the all notes array directly', async () => {
    const notes = [mockMarkdownNote({ id: 'abc' }), mockMarkdownNote({ id: 'efg' })]
    const config = mockConfig({ mode: 'bear' })

    const result = await allNotes({}, { allNotes: notes, config, db })

    expect(result).toEqual(notes)
  })
})
