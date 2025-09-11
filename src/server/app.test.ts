import request from 'supertest'

import { loadConfig } from '../config'
import { asMock, mockConfig, mockMarkdownNote } from '../testing-support/mocks'
import { app } from './app'
import * as bearMode from './interfaces/bear/main'

jest.mock('@/marked/main', () => ({
  lexer: jest.fn(),
}))

jest.mock('./interfaces/bear/main')

const config = mockConfig()
beforeEach(() => {
  asMock(loadConfig).mockResolvedValue(config)
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

describe('interface modes', () => {
  test('loads the bear interface mode based on the configuration', async () => {
    await request(app).get('/api/notes/123')

    expect(bearMode.init).toHaveBeenCalled()
    expect(bearMode.noteById).toHaveBeenCalled()
  })
})

describe('GET /api/notes', () => {
  test('returns an array of notes', async () => {
    const mockNotes = [
      mockMarkdownNote({ id: 'a' }),
      mockMarkdownNote({ id: 'b' }),
      mockMarkdownNote({ id: 'c' }),
    ]
    asMock(bearMode.allNotes).mockResolvedValue(mockNotes)

    const res = await request(app).get('/api/notes')

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(3)
  })
})

describe('GET /api/notes/:noteId', () => {
  test('returns note JSON when found', async () => {
    const mockNote = mockMarkdownNote()
    asMock(bearMode.noteById).mockResolvedValue(mockNote)

    const response = await request(app).get('/api/notes/123')

    expect(response.status).toBe(200)
  })

  test('returns 404 when note not found', async () => {
    asMock(bearMode.noteById).mockResolvedValue(null)

    const response = await request(app).get('/api/notes/999')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: "note with ID '999' not found" })
  })
})

test('returns 500 and error message when an error is thrown', async () => {
  const config = mockConfig()
  asMock(loadConfig).mockResolvedValue(config)

  asMock(bearMode.noteById).mockRejectedValue('error')

  const response = await request(app).get('/api/notes/any-id')
  expect(response.status).toBe(500)
  expect(response.body).toEqual({ error: 'Internal Server Error' })
})
