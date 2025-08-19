import express from 'express'
import path from 'path'
const app = express()

app.use(express.static(path.join(__dirname, '../../dist')))

app.get('/{*splat}', async (_req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'))
})

export default app
