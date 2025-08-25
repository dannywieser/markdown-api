import { loadConfig } from '@/config'
import { activity, header1 } from '@/util/logging'

import app from './app'

const config = loadConfig()
const port = process.env.PORT || 3100
const host = process.env.HOST || 'localhost'

const startMessage = () => {
  header1('Markdown Memory')
  activity(`server running: http://${host}:${port}`)
  activity(`root directory: ${config.rootDir}`)
}

app.listen(port, () => startMessage())
