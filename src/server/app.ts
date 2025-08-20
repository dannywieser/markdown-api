import express from 'express'
import path from 'path'

import { noteByUniqueId } from './noteCache/bear/main'
const app = express()

app.use(express.static(path.join(__dirname, '../../dist-web')))

app.get('/api/notes/:noteId', async ({ params: { noteId } }, res) => {
  const note = await noteByUniqueId(noteId)
  res.send(JSON.stringify(note))
})

app.get('/{*splat}', async (_req, res) => {
  res.sendFile(path.join(__dirname, '../../dist-web/index.html'))
})

export default app
