#!/usr/bin/env node

import { Config, loadConfig } from '../config'
import { activity, header1 } from '../util/logging'
import { app } from './app'

export const startMessage = ({ host, port, rootDir }: Config) => {
  activity(`server running: http://${host}:${port}`)
  activity(`root directory: ${rootDir}`)
}

export const startup = async () => {
  header1('🤖🐻 Bear Markdown API 🐻🤖')
  const config = await loadConfig()
  const { host, port } = config
  const server = app.listen(port, host, () => startMessage(config))
  server.on('error', (err) => {
    console.error('server error:', err)
    process.exit(1)
  })
}

startup()
