import { loadConfig } from '@/config'
import { activity, header1 } from '@/util/logging'

import app from './app'

const { host, mode, port, rootDir } = loadConfig()

export const startMessage = () => {
  header1('Markdown Memory')
  activity(`server running: http://${host}:${port}`)
  activity(`root directory: ${rootDir}`)
  activity(`mode: ${mode}`)
}

export const startup = () => app.listen(port, () => startMessage())

startup()
