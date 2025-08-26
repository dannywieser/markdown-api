import { open } from 'sqlite'
import * as sqlite3 from 'sqlite3'

import { asMock } from '@/testing-support'

import { backupBearDatabase } from './backup'
import { loadDatabase } from './database'

jest.mock('./backup')
jest.mock('sqlite')

const mockDb = { db: true }
const mockBackupFile = '/mock/path/to/backup.sqlite'

beforeEach(() => {
  asMock(backupBearDatabase).mockReturnValue(mockBackupFile)
  asMock(open).mockResolvedValue(mockDb)
})

test('calls backupBearDatabase and opens the backup file', async () => {
  const db = await loadDatabase()

  expect(backupBearDatabase).toHaveBeenCalled()
  expect(open).toHaveBeenCalledWith({
    driver: sqlite3.Database,
    filename: mockBackupFile,
  })
  expect(db).toBe(mockDb)
})
