import * as fsSync from 'fs'
import fs from 'fs/promises'

import { asMock } from '../testing-support/mocks'
import { createDir, expandPath, fileExists, readJSONFile } from './file'
import { isNotFoundError } from './file'
import { readFile } from './file'

jest.mock('fs')
jest.mock('fs/promises')
jest.mock('./logging')

jest.mock('os', () => ({
  homedir: jest.fn(() => '/mock/home'),
}))
jest.mock('path', () => ({
  join: jest.fn((...args: string[]) => args.join('/')),
}))

describe('expandPath', () => {
  test('expands ~ to home directory', () => {
    expect(expandPath('~/documents')).toBe('/mock/home/documents')
  })

  test('removes double forward slashes', () => {
    expect(expandPath('~//documents')).toBe('/mock/home/documents')
  })

  test('returns path unchanged if no ~', () => {
    expect(expandPath('/some/other/path')).toBe('/some/other/path')
  })
})

describe('isNotFoundError', () => {
  test('returns true for ENOENT error object', () => {
    const err = { code: 'ENOENT' }
    expect(isNotFoundError(err)).toBe(true)
  })

  test('returns false for other error codes', () => {
    const err = { code: 'EACCES' }
    expect(isNotFoundError(err)).toBe(false)
  })

  test('returns false for objects without code property', () => {
    const err = { message: 'not found' }
    expect(isNotFoundError(err)).toBe(false)
  })

  test('returns false for null', () => {
    expect(isNotFoundError(null)).toBe(false)
  })

  test('returns false for non-object types', () => {
    expect(isNotFoundError('ENOENT')).toBe(false)
    expect(isNotFoundError(404)).toBe(false)
    expect(isNotFoundError(undefined)).toBe(false)
  })
})

describe('readFile', () => {
  beforeEach(() => {
    asMock(fs.readFile).mockReset()
  })

  test('returns file content when file exists', async () => {
    asMock(fs.readFile).mockResolvedValue('file contents')
    const result = await readFile('/path/to/file.txt')
    expect(result).toBe('file contents')
    expect(fs.readFile).toHaveBeenCalledWith('/path/to/file.txt', 'utf-8')
  })

  test('returns null when file does not exist (ENOENT)', async () => {
    const error = { code: 'ENOENT' }
    asMock(fs.readFile).mockRejectedValue(error)
    const result = await readFile('/path/to/missing.txt')
    expect(result).toBeNull()
  })

  test('throws error for non-ENOENT errors', async () => {
    const error = { code: 'EACCES' }
    asMock(fs.readFile).mockRejectedValue(error)
    await expect(readFile('/path/to/protected.txt')).rejects.toEqual(error)
  })
})

describe('createDir', () => {
  test('creates directory if it does not exist', () => {
    const existsSyncMock = fsSync.existsSync as jest.Mock
    const mkdirSyncMock = fsSync.mkdirSync as jest.Mock
    existsSyncMock.mockReturnValue(false)

    createDir('/some/dir')

    expect(mkdirSyncMock).toHaveBeenCalledWith('/some/dir', { recursive: true })
  })

  test('does not create directory if it exists', () => {
    const existsSyncMock = fsSync.existsSync as jest.Mock
    const mkdirSyncMock = fsSync.mkdirSync as jest.Mock
    existsSyncMock.mockReturnValue(true)

    createDir('/some/dir')

    expect(mkdirSyncMock).not.toHaveBeenCalled()
  })
})

describe('readJSONFile', () => {
  test('parses JSON from file', () => {
    const mockData = { foo: 'bar' }
    asMock(fsSync.readFileSync).mockReturnValue(JSON.stringify(mockData))

    const result = readJSONFile('/some/file.json')

    expect(result).toEqual(mockData)
    expect(fsSync.readFileSync).toHaveBeenCalledWith('/some/file.json', 'utf-8')
  })
})

describe('fileExists', () => {
  test('returns true if file exists', () => {
    asMock(fsSync.existsSync).mockReturnValue(true)

    expect(fileExists('/some/file.txt')).toBe(true)

    expect(fsSync.existsSync).toHaveBeenCalledWith('/some/file.txt')
  })

  test('returns false if file does not exist', () => {
    asMock(fsSync.existsSync).mockReturnValue(false)

    expect(fileExists('/some/file.txt')).toBe(false)

    expect(fsSync.existsSync).toHaveBeenCalledWith('/some/file.txt')
  })
})
