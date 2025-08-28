import { loadConfig } from '@/config'
import { asMock, mockConfig } from '@/testing-support'
import { readFile } from '@/util'

import { init, noteById } from './main'

jest.mock('@/config')
jest.mock('@/util')
jest.mock('path', () => ({
  join: jest.fn((...args: string[]) => args.join('/')),
}))

describe('bear interface functions', () => {
  test('init is no-op', async () => {
    const { db } = await init()

    expect(db).not.toBeDefined()
  })

  test('file path is correctly built based on config', async () => {
    const config = mockConfig()
    asMock(loadConfig).mockReturnValue(config)
    asMock(readFile).mockResolvedValue('foo')

    await noteById('some-id', {})

    expect(readFile).toHaveBeenCalledWith('/path/to/files/some-id.md')
  })

  test('noteById returns note text read from file', async () => {
    asMock(readFile).mockResolvedValue('foo')

    const result = await noteById('some-id', {})

    expect(result).toHaveProperty('note')
    expect(result?.note).toEqual('foo')
  })

  test('noteById returns null if note is not found', async () => {
    asMock(readFile).mockResolvedValue(null)

    const result = await noteById('some-id', {})

    expect(result).toBeNull()
  })
})
