import { parse } from 'date-fns'
import fs, { Dirent, PathLike, Stats, StatSyncOptions } from 'fs'

import { asMock } from '@/testing-support'

import { backupFile, backupPrune } from './backup'

jest.mock('fs')
jest.mock('@/config')
jest.mock('./logging')

const backupPrefix = 'backup-'
const backupDir = 'backups/'

beforeEach(() => {
  asMock(fs.statSync).mockImplementation(
    (file: PathLike, _options: StatSyncOptions | undefined) => {
      const fileStr = file as string
      const split = fileStr.split('-')
      const mtime = parse(split[1] ?? '', 'yyyyMMdd', new Date())
      return { mtime } as Stats
    }
  )
})

const mockBackups = (count: number) => {
  const backups = Array.from({ length: count }, (_, i) => {
    const num = String(i + 1).padStart(2, '0')
    return `backup-20240101-${num}`
  }) as unknown as Dirent<Buffer<ArrayBufferLike>>[]

  asMock(fs.readdirSync).mockReturnValue(backups)
}

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

    expect(fs.copyFileSync).toHaveBeenCalledWith('source.txt', '/mock/dest/file.txt')
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
    mockBackups(2)
    backupPrune(backupPrefix, backupDir, 5)

    expect(fs.unlinkSync).not.toHaveBeenCalled()
  })

  test('removes oldest copy by modified date if there are more backups than the defined maximum', () => {
    mockBackups(6)
    backupPrune(backupPrefix, backupDir, 5)

    expect(fs.unlinkSync).toHaveBeenCalledWith('backups/backup-20240101-06')
  })

  test('removes all files that exceed the defined maximum', () => {
    mockBackups(10)

    backupPrune(backupPrefix, backupDir, 5)

    expect(fs.unlinkSync).toHaveBeenCalledWith('backups/backup-20240101-06')
    expect(fs.unlinkSync).toHaveBeenCalledWith('backups/backup-20240101-07')
    expect(fs.unlinkSync).toHaveBeenCalledWith('backups/backup-20240101-08')
    expect(fs.unlinkSync).toHaveBeenCalledWith('backups/backup-20240101-09')
    expect(fs.unlinkSync).toHaveBeenCalledWith('backups/backup-20240101-10')
  })
})
