import express from 'express'
import path from 'path'

import { extractBear } from './noteCache/bear/main'
const app = express()

app.use(express.static(path.join(__dirname, '../../dist')))

app.get('/api/notes/:noteId', async ({ params: { noteId } }, res) => {
  const note = `hello world from markdown ${noteId}`
  extractBear()
  res.send(note)
})

app.get('/{*splat}', async (_req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'))
})

export default app
