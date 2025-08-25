import { loadConfig } from '@/config'
import { asMock } from '@/testing-support'
import { backupFile, cleanBackups, dateWithHour } from '@/util'

import { backupBearDatabase } from './backup'

jest.mock('@/util')
jest.mock('@/config')

const mockConfig = {
  bearDatabase: '/path/to/beardb',
  keepBackups: 2,
  rootDir: '/mock/root',
}

beforeEach(() => {
  jest.clearAllMocks()
  asMock(loadConfig).mockReturnValue(mockConfig)
  asMock(dateWithHour).mockReturnValue('20240101-11')
})

describe('backupBearDatabase', () => {
  test('calls backupFile with correct arguments', () => {
    backupBearDatabase()

    expect(backupFile).toHaveBeenCalledWith(
      '/path/to/beardb',
      '/mock/root/bear-backups',
      '/mock/root/bear-backups/bear-backup-20240101-11.sqlite'
    )
  })

  test('calls cleanBackups with correct arguments', () => {
    backupBearDatabase()
    expect(cleanBackups).toHaveBeenCalledWith(
      'bear-backup-',
      '/mock/root/bear-backups',
      2
    )
  })

  test('returns the backup file path', () => {
    const result = backupBearDatabase()
    expect(result).toMatch(
      '/mock/root/bear-backups/bear-backup-20240101-11.sqlite'
    )
  })
})
