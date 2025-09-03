import { TokensList } from 'marked'
import { Database } from 'sqlite'

import { lexer } from '@/marked/main'
import { asMock } from '@/testing-support'
import { convertDate } from '@/util'

import { backupBearDatabase, loadDatabase } from './database'
import { init, noteById } from './main'

jest.mock('@/marked/main', () => ({
  lexer: jest.fn(),
}))
jest.mock('@/util')
jest.mock('./database')

const setupInitMock = (noteText = 'this is the note text') => {
  const all = jest
    .fn()
    .mockReturnValue([{ ZCREATIONDATE: 4, ZMODIFICATIONDATE: 5, ZTEXT: noteText }])
  const get = jest.fn().mockReturnValue({ ZCREATIONDATE: 4, ZMODIFICATIONDATE: 5, ZTEXT: noteText })
  const db = { all, get } as unknown as Database
  return { db }
}

describe('bear interface functions', () => {
  test('init will backup the database and return a connection to the backup', async () => {
    const mockDb = {} as Promise<Database>
    asMock(backupBearDatabase).mockReturnValue('path/to/db')
    asMock(loadDatabase).mockResolvedValue(mockDb)

    const { db } = await init()

    expect(backupBearDatabase).toHaveBeenCalled()
    expect(loadDatabase).toHaveBeenCalled()
    expect(db).toBe(mockDb)
  })

  test('noteById returns note object', async () => {
    const init = setupInitMock('foo')
    const mockDate = new Date()
    asMock(convertDate).mockReturnValue(mockDate)
    asMock(lexer).mockReturnValue([] as unknown as TokensList)

    const result = await noteById('some-id', init)

    expect(result?.id).toBe('some-id')
    expect(result?.tokens).toEqual([])
    expect(result?.created).toEqual(mockDate)
    expect(result?.modified).toEqual(mockDate)
    expect(result?.source).toBe('bear')
  })

  test('noteById throws an error if the db is missing', async () => {
    expect(async () => await noteById('some-id', {})).rejects.toThrow('database not ready')
  })

  test('noteById returns null if note is not found', async () => {
    const init = setupInitMock('foo')
    asMock(init.db.get).mockResolvedValue(undefined)

    const result = await noteById('some-id', init)

    expect(result).toBeNull()
  })
})
