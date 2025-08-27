import express, { NextFunction, Request, Response } from 'express'
import path from 'path'

import { loadConfig } from '@/config'

import * as bearMod from './interfaces/bear/main'
import * as fileMod from './interfaces/file/main'

const getMod = () => {
  const { mode } = loadConfig()
  if (mode === 'bear') {
    return bearMod
  }
  if (mode === 'file') {
    return fileMod
  }
  throw new Error('invalid mode')
}

const app = express()

app.use(express.static(path.join(__dirname, '../../dist-web')))

app.get('/api/notes/:noteId', async ({ params: { noteId } }, res, next) => {
  const mod = getMod()
  try {
    const result = await mod.noteByUniqueId(noteId)
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
