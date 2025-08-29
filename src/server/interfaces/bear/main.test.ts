import { Database } from 'sqlite'

import { asMock } from '@/testing-support'

import { backupBearDatabase, loadDatabase } from './database'
import { init, noteById } from './main'

jest.mock('@/util')
jest.mock('./database')
jest.mock('./bear.util')

const setupInitMock = (noteText = 'this is the note text') => {
  const get = jest.fn().mockReturnValue({ ZTEXT: noteText })
  const db = { get } as unknown as Database
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

    const result = await noteById('some-id', init)

    expect(result).toHaveProperty('note')
    expect(result?.note).toEqual('foo')
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
