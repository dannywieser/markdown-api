import { Database } from 'sqlite'

import { asMock, mockBearNote, mockConfig } from '../../../testing-support/mocks'
import { convertDate } from '../../../util'
import { processNotes } from './processNotes'

jest.mock('@/util', () => ({
  convertDate: jest.fn((date) => new Date(date * 1000)),
}))

const bearResults = [mockBearNote('a'), mockBearNote('b'), mockBearNote('c')]

describe('processNotes', () => {
  test('maps raw BearNote objects to MarkdownNote objects', async () => {
    const mockDb = { all: jest.fn().mockResolvedValue(bearResults) } as unknown as Database
    const mockDate = new Date()
    asMock(convertDate).mockReturnValue(mockDate)
    const config = mockConfig()

    const result = await processNotes(mockDb, config)

    expect(mockDb.all).toHaveBeenCalledWith('SELECT * FROM ZSFNOTE where ZTRASHED=0')
    expect(result[0]?.id).toBe('a')
    expect(result[0]?.created).toEqual(mockDate)
    expect(result[0]?.modified).toEqual(mockDate)
    expect(result[0]?.source).toBe('bear')
    expect(result[0]?.title).toBe('a title')
    expect(result[0]?.text).toBe('a text')
    expect(result[0]?.externalUrl).toBe('/path/in/bear?id=a')
    expect(result[0]?.self).toBe('/api/notes/a')
    expect(result[0]?.noteUrl).toBe('/path/to/web/a')

    expect(result[1]?.id).toBe('b')
    expect(result[1]?.created).toEqual(mockDate)
    expect(result[1]?.modified).toEqual(mockDate)
    expect(result[1]?.source).toBe('bear')
    expect(result[1]?.title).toBe('b title')
    expect(result[1]?.text).toBe('b text')
    expect(result[1]?.externalUrl).toBe('/path/in/bear?id=b')
    expect(result[1]?.self).toBe('/api/notes/b')
    expect(result[1]?.noteUrl).toBe('/path/to/web/b')

    expect(result[2]?.id).toBe('c')
    expect(result[2]?.created).toEqual(mockDate)
    expect(result[2]?.modified).toEqual(mockDate)
    expect(result[2]?.source).toBe('bear')
    expect(result[2]?.title).toBe('c title')
    expect(result[2]?.text).toBe('c text')
    expect(result[2]?.externalUrl).toBe('/path/in/bear?id=c')
    expect(result[2]?.self).toBe('/api/notes/c')
    expect(result[2]?.noteUrl).toBe('/path/to/web/c')
  })

  test('returns an empty array if no notes are found', async () => {
    const mockDb = {
      all: jest.fn().mockResolvedValue([]),
    } as unknown as Database
    const config = mockConfig()

    const result = await processNotes(mockDb, config)
    expect(result).toEqual([])
  })
})
