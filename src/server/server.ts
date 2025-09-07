#!/usr/bin/env node

import { Config, loadConfig } from '../config'
import { activity, header1 } from '../util/logging'
import { app } from './app'

export const startMessage = ({ host, mode, port, rootDir }: Config) => {
  activity(`server running: http://${host}:${port}`)
  activity(`root directory: ${rootDir}`)
  activity(`mode: ${mode}`)
}

export const startup = async () => {
  header1('🤖 Markdown API 🤖')
  const config = await loadConfig()
  const { host, port } = config
  app.listen(port, host, () => startMessage(config))
}

startup()
