import { Database } from 'sqlite'

import { asMock } from '@/testing-support'

import { loadDatabase } from './database'
import { noteByUniqueId } from './main'

jest.mock('./database')

const setupDatabaseMock = (noteText = 'this is the note text') => {
  const get = jest.fn().mockReturnValue({ ZTEXT: noteText })
  const mock = { get } as unknown as Database
  asMock(loadDatabase).mockResolvedValue(mock)
}

test('noteByUniqueId returns note object', async () => {
  setupDatabaseMock('foo')

  const result = await noteByUniqueId('some-id')

  expect(result).toHaveProperty('note')
  expect(result?.note).toEqual('foo')
})
