import express, { NextFunction, Request, Response } from 'express'
import path from 'path'

import { loadInterface } from './interfaces/load'

const app = express()

app.use(express.static(path.join(__dirname, '../../dist-web')))

app.get('/api/notes/:noteId', async ({ params: { noteId } }, res, next) => {
  const mode = loadInterface()
  const init = await mode.init()
  try {
    const result = await mode.noteById(noteId, init)
    if (!result) {
      return res
        .status(404)
        .json({ error: `note with ID '${noteId}' not found` })
    }
    res.json(result)
  } catch (err) {
    next(err)
  }
})

// serve single page app
const webPath = path.join(__dirname, '../../dist-web/index.html')
app.get('/{*splat}', async (_req, res) => res.sendFile(webPath))

// error handling
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

export default app
