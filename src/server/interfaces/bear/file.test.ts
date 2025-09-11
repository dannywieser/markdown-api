import { mockMarkdownNote } from '../../../testing-support'
import { MarkdownInit } from '../interfaces.types'
import { getFilesForNote } from './files'

describe('getFilesForNote', () => {
  const config = { imageRoot: '/images' }
  const db = {
    all: jest.fn(),
  }

  const init = { config, db } as unknown as MarkdownInit

  test('returns mapped files when db returns results', async () => {
    db.all.mockResolvedValue([
      { ZFILENAME: 'file1.png', ZUNIQUEIDENTIFIER: 'dir1' },
      { ZFILENAME: 'file2.jpg', ZUNIQUEIDENTIFIER: 'dir2' },
    ])
    const note = mockMarkdownNote({ primaryKey: 123 })
    const result = await getFilesForNote(note, init)

    expect(result).toEqual([
      {
        directory: 'dir1',
        file: 'file1.png',
        path: '/images/dir1/file1.png',
      },
      {
        directory: 'dir2',
        file: 'file2.jpg',
        path: '/images/dir2/file2.jpg',
      },
    ])
    expect(db.all).toHaveBeenCalledWith('SELECT * FROM ZSFNOTEFILE where ZNOTE=?', 123)
  })

  it('returns empty array when db returns null/undefined', async () => {
    db.all.mockResolvedValue(null)
    const note = { primaryKey: 456 }

    const result = await getFilesForNote(note as any, init as any)

    expect(result).toEqual([])
  })

  it('returns empty array when db returns empty array', async () => {
    db.all.mockResolvedValue([])
    const note = { primaryKey: 789 }

    const result = await getFilesForNote(note as any, init as any)

    expect(result).toEqual([])
  })
})
