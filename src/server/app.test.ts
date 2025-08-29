import request from 'supertest'

import { loadConfig } from '@/config'

import { asMock, mockConfig } from '../testing-support/mocks'
import app from './app'
import * as bearMode from './interfaces/bear/main'
import * as fileMode from './interfaces/file/main'
import { MarkdownNote } from './interfaces/interfaces.types'

jest.mock('@/marked/main', () => ({
  lexer: jest.fn(),
}))
jest.mock('@/config')
jest.mock('./interfaces/bear/main')
jest.mock('./interfaces/file/main')

const mockNote = {} as unknown as MarkdownNote

const config = mockConfig()
beforeEach(() => {
  asMock(loadConfig).mockReturnValue(config)
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

describe('interface modes', () => {
  test('loads the bear interface mode based on the configuration', async () => {
    const bearConfig = mockConfig({ mode: 'bear' })
    asMock(loadConfig).mockReturnValue(bearConfig)

    await request(app).get('/api/notes/123')

    expect(bearMode.init).toHaveBeenCalled()
    expect(bearMode.noteById).toHaveBeenCalled()

    expect(fileMode.init).not.toHaveBeenCalled()
    expect(fileMode.noteById).not.toHaveBeenCalled()
  })

  test('loads the file interface mode based on the configuration', async () => {
    const fileConfig = mockConfig({ mode: 'file' })
    asMock(loadConfig).mockReturnValue(fileConfig)

    await request(app).get('/api/notes/123')

    expect(bearMode.init).not.toHaveBeenCalled()
    expect(bearMode.noteById).not.toHaveBeenCalled()

    expect(fileMode.init).toHaveBeenCalled()
    expect(fileMode.noteById).toHaveBeenCalled()
  })
})

describe('GET /api/notes/:noteId', () => {
  test('returns note JSON when found', async () => {
    asMock(bearMode.noteById).mockResolvedValue(mockNote)

    const response = await request(app).get('/api/notes/123')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockNote)
  })

  test('returns 404 when note not found', async () => {
    asMock(bearMode.noteById).mockResolvedValue(null)

    const response = await request(app).get('/api/notes/999')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: "note with ID '999' not found" })
  })
})

test('returns 500 and error message when an error is thrown', async () => {
  const fileConfig = mockConfig({ mode: 'file' })
  asMock(loadConfig).mockReturnValue(fileConfig)

  asMock(fileMode.noteById).mockRejectedValue('error')

  const response = await request(app).get('/api/notes/any-id')
  expect(response.status).toBe(500)
  expect(response.body).toEqual({ error: 'Internal Server Error' })
})
