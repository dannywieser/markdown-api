import { Database } from 'sqlite'

import { asMock, mockBearNote } from '@/testing-support/mocks'
import { convertDate } from '@/util'

import { noteCache } from './noteCache'

jest.mock('@/util', () => ({
  convertDate: jest.fn((date) => new Date(date * 1000)),
}))

const bearResults = [mockBearNote('a'), mockBearNote('b'), mockBearNote('c')]

describe('noteCache', () => {
  test('maps raw BearNote objects to MarkdownNote objects', async () => {
    const mockDb = { all: jest.fn().mockResolvedValue(bearResults) } as unknown as Database
    const mockDate = new Date()
    asMock(convertDate).mockReturnValue(mockDate)

    const result = await noteCache(mockDb)

    expect(mockDb.all).toHaveBeenCalledWith('SELECT * FROM ZSFNOTE')
    expect(result[0]?.id).toBe('a')
    expect(result[0]?.created).toEqual(mockDate)
    expect(result[0]?.modified).toEqual(mockDate)
    expect(result[0]?.source).toBe('bear')
    expect(result[0]?.title).toBe('a title')
    expect(result[0]?.text).toBe('a text')

    expect(result[1]?.id).toBe('b')
    expect(result[1]?.created).toEqual(mockDate)
    expect(result[1]?.modified).toEqual(mockDate)
    expect(result[1]?.source).toBe('bear')
    expect(result[1]?.title).toBe('b title')
    expect(result[1]?.text).toBe('b text')

    expect(result[2]?.id).toBe('c')
    expect(result[2]?.created).toEqual(mockDate)
    expect(result[2]?.modified).toEqual(mockDate)
    expect(result[2]?.source).toBe('bear')
    expect(result[2]?.title).toBe('c title')
    expect(result[2]?.text).toBe('c text')
  })

  test('returns an empty array if no notes are found', async () => {
    const mockDb = {
      all: jest.fn().mockResolvedValue([]),
    } as unknown as Database

    const result = await noteCache(mockDb)
    expect(result).toEqual([])
  })
})
