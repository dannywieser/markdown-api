import { parse } from 'date-fns'
import fs from 'fs'

import { asMock } from '@/testing-support'

import { backupFile, backupPrune } from './backup'

jest.mock('fs')
jest.mock('@/config')
jest.mock('./logging')

const backupPrefix = 'backup-'
const backupDir = 'backups/'

beforeEach(() => {
  asMock(fs.statSync).mockImplementation((file: string) => {
    const split = file.split('-')
    const mtime = parse(split[1], 'yyyyMMdd', new Date())
    return { mtime }
  })
})

describe('the backupFile function', () => {
  test('throws if the source file does not exist', () => {
    asMock(fs.existsSync).mockReturnValueOnce(false)

    expect(() => backupFile('source.txt', '/mock/dest', 'file.txt')).toThrow(
      'source file source.txt does not exist'
    )
  })

  test('creates destination directory if it does not exist', () => {
    // return true once for source file check
    asMock(fs.existsSync).mockReturnValueOnce(true)
    // but then false for the target directory
    asMock(fs.existsSync).mockReturnValueOnce(false)

    backupFile('source.txt', '/mock/dest', 'file.txt')

    expect(fs.existsSync).toHaveBeenCalledWith('/mock/dest')
    expect(fs.mkdirSync).toHaveBeenCalledWith('/mock/dest', { recursive: true })
  })

  test('copies the source file to the destination', () => {
    // source file and target dir both exist
    asMock(fs.existsSync).mockReturnValue(true)

    backupFile('source.txt', '/mock/dest', 'file.txt')

    expect(fs.copyFileSync).toHaveBeenCalledWith(
      'source.txt',
      '/mock/dest/file.txt'
    )
  })

  test('returns the destination file path', () => {
    // source file and target dir both exist
    asMock(fs.existsSync).mockReturnValue(true)

    const result = backupFile('source.txt', '/mock/dest', 'file.txt')

    expect(result).toBe('/mock/dest/file.txt')
  })
})

describe('the backupPrune function', () => {
  test('takes no action if the number of backups is less than the maximum', () => {
    asMock(fs.readdirSync).mockReturnValue([
      'backup-20240105-11',
      'backup-20240106-11',
    ])

    backupPrune(backupPrefix, backupDir, 5)

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

    backupPrune(backupPrefix, backupDir, 5)

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

    backupPrune(backupPrefix, backupDir, 5)

    expect(fs.unlinkSync).toHaveBeenCalledWith('backups/backup-20231230-02')
    expect(fs.unlinkSync).toHaveBeenCalledWith('backups/backup-20231231-02')
    expect(fs.unlinkSync).toHaveBeenCalledWith('backups/backup-20240101-02')
  })
})
