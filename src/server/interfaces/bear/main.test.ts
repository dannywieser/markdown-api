import { TokensList } from 'marked'
import { Database } from 'sqlite'

import { lexer } from '@/marked/main'
import { asMock, mockBearNote } from '@/testing-support'
import { convertDate } from '@/util'

import { backupBearDatabase, loadDatabase } from './database'
import { init, noteById } from './main'

jest.mock('@/marked/main', () => ({
  lexer: jest.fn(),
}))
jest.mock('@/util')
jest.mock('./database')

const setupInitMock = () => {
  const all = jest.fn().mockResolvedValue([mockBearNote('a'), mockBearNote('b'), mockBearNote('c')])
  const get = jest.fn().mockResolvedValue(mockBearNote('d'))
  const db = { all, get } as unknown as Database
  return { db }
}

describe('bear interface functions', () => {
  test('init backs up the database and returns a connection to the backup', async () => {
    const mockDb = {} as Database
    asMock(backupBearDatabase).mockReturnValue('path/to/db')
    asMock(loadDatabase).mockResolvedValue(mockDb)

    const result = await init()

    expect(backupBearDatabase).toHaveBeenCalled()
    expect(loadDatabase).toHaveBeenCalledWith('path/to/db')
    expect(result.db).toBe(mockDb)
  })

  test('noteById returns note object when found', async () => {
    const initObj = setupInitMock()
    const mockDate = new Date()
    asMock(convertDate).mockReturnValue(mockDate)
    asMock(lexer).mockReturnValue([] as unknown as TokensList)

    const result = await noteById('a', initObj)

    expect(result?.id).toBe('a')
    expect(result?.tokens).toEqual([])
    expect(result?.created).toEqual(mockDate)
    expect(result?.modified).toEqual(mockDate)
    expect(result?.source).toBe('bear')
    expect(result?.title).toBe('a title')
    expect(result?.text).toBe('a text')
  })

  test('noteById throws an error if db is missing', async () => {
    await expect(noteById('some-id', {})).rejects.toThrow('database not ready')
  })

  test('noteById returns null if note is not found', async () => {
    const initObj = setupInitMock()
    asMock(initObj.db.get).mockResolvedValue(undefined)

    const result = await noteById('some-id', initObj)

    expect(result).toBeNull()
  })
})
