import express, { NextFunction, Request, Response } from 'express'

import { loadInterface } from './interfaces/load'

const app = express()

app.get('/api/notes/:noteId', async ({ params: { noteId } }, res, next) => {
  const mode = loadInterface()
  const init = await mode.init()
  try {
    const result = await mode.noteById(noteId, init)
    if (!result) {
      return res.status(404).json({ error: `note with ID '${noteId}' not found` })
    }
    res.json(result)
  } catch (err) {
    next(err)
  }
})

// error handling
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

export default app
