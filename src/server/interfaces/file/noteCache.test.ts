import { Dirent, Stats } from 'fs'
import fs from 'fs/promises'
import path from 'path'

import { asMock } from '../../../testing-support'
import { noteCache } from './noteCache'

jest.mock('fs/promises')
jest.mock('path', () => ({
  basename: jest.fn((file, ext) => file.replace(ext, '')),
  join: jest.fn((...args) => args.join('/')),
}))

const mockFiles = ['note1.md', 'note2.md'] as unknown as Dirent<Buffer<ArrayBufferLike>>[]
const mockStats = [
  { birthtime: new Date(1000), mtime: new Date(2000) },
  { birthtime: new Date(3000), mtime: new Date(4000) },
] as unknown as Stats[]

const setupMocks = () => {
  asMock(fs.readdir).mockResolvedValue(mockFiles)
  asMock(fs.stat).mockResolvedValueOnce(mockStats[0]!).mockResolvedValueOnce(mockStats[1]!)
  asMock(path.basename).mockImplementation((file, ext) => file.replace(ext ?? '', ''))
}

describe('noteCache', () => {
  test('returns notes with correct metadata for .md files', async () => {
    setupMocks()
    const result = await noteCache('/mock/root')

    expect(fs.readdir).toHaveBeenCalledWith('/mock/root')
    expect(fs.stat).toHaveBeenCalledWith('/mock/root/note1.md')
    expect(fs.stat).toHaveBeenCalledWith('/mock/root/note2.md')

    expect(result).toEqual([
      {
        created: mockStats[0]?.birthtime,
        id: 'note1',
        modified: mockStats[0]?.mtime,
        noteUrl: '/note/note1',
        source: 'obsidian',
        sourceFile: 'note1.md',
        title: 'note1',
      },
      {
        created: mockStats[1]?.birthtime,
        id: 'note2',
        modified: mockStats[1]?.mtime,
        noteUrl: '/note/note2',
        source: 'obsidian',
        sourceFile: 'note2.md',
        title: 'note2',
      },
    ])
  })

  test('returns empty array if no files found', async () => {
    ;(fs.readdir as jest.Mock).mockResolvedValue([])
    const result = await noteCache('/mock/root')
    expect(result).toEqual([])
  })
})
