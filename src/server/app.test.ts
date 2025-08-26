import request from 'supertest'

import { asMock } from '../testing-support/mocks'
import app from './app'
import { noteByUniqueId } from './interfaces/bear/main'

jest.mock('./interfaces/bear/main')

const mockNote = { note: 'text' }

beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}))

test('GET /api/notes/:noteId returns note JSON when found', async () => {
  asMock(noteByUniqueId).mockResolvedValue(mockNote)

  const response = await request(app).get('/api/notes/123')

  expect(noteByUniqueId).toHaveBeenCalledWith('123')
  expect(response.status).toBe(200)
  expect(response.body).toEqual(mockNote)
})

test('GET /api/notes/:noteId returns 404 when note not found', async () => {
  asMock(noteByUniqueId).mockResolvedValue(undefined)

  const response = await request(app).get('/api/notes/999')

  expect(response.status).toBe(404)
  expect(response.body).toEqual({ error: "note with ID '999' not found" })
})

test('GET /api/notes/:noteId returns 500 on error', async () => {
  asMock(noteByUniqueId).mockImplementation(() => {
    throw new Error('Database error')
  })

  const response = await request(app).get('/api/notes/123')

  expect(response.status).toBe(500)
  expect(response.body).toEqual({ error: 'Internal Server Error' })
})
