import { parse } from 'date-fns'
import fs from 'fs'

import { asMock } from '@/testing-support'

import { cleanBackups } from './backup'

jest.mock('fs')
jest.mock('@/config')
jest.mock('./logging')

const backupPrefix = 'backup-'
const backupDir = 'backups/'

beforeEach(() => {
  jest.clearAllMocks()
  asMock(fs.existsSync).mockReturnValue(false)
  asMock(fs.readdirSync).mockReturnValue([])
  asMock(fs.statSync).mockImplementation((file: string) => {
    const split = file.split('-')
    const mtime = parse(split[1], 'yyyyMMdd', new Date())
    return { mtime }
  })
  asMock(fs.unlinkSync).mockImplementation(() => {})
})

describe('the cleanupOldBackups function', () => {
  test('takes no action if the number of backups is less than the maximum', () => {
    cleanBackups(backupPrefix, backupDir, 5)

    expect(fs.unlinkSync).not.toHaveBeenCalled()
  })

  test('removes oldest copy by modified date if there are more backups than the defined maximum', () => {
    asMock(fs.readdirSync).mockReturnValue([
      'backup-20240101-02',
      'backup-20240102-05',
      'backup-20240103-08',
      'backup-20240104-01',
      'backup-20240105-11',
      'backup-20240106-11',
    ])

    cleanBackups(backupPrefix, backupDir, 5)

    expect(fs.unlinkSync).toHaveBeenCalledWith('backups/backup-20240101-02')
  })

  test('removes all files that exceed the defined maximum', () => {
    asMock(fs.readdirSync).mockReturnValue([
      'backup-20231230-02',
      'backup-20231231-02',
      'backup-20240101-02',
      'backup-20240102-05',
      'backup-20240103-08',
      'backup-20240104-01',
      'backup-20240105-11',
      'backup-20240106-11',
    ])

    cleanBackups(backupPrefix, backupDir, 5)

    expect(fs.unlinkSync).toHaveBeenCalledWith('backups/backup-20231230-02')
    expect(fs.unlinkSync).toHaveBeenCalledWith('backups/backup-20231231-02')
    expect(fs.unlinkSync).toHaveBeenCalledWith('backups/backup-20240101-02')
  })
})
