#!/usr/bin/env node

import express from 'express'

import { Config, loadConfig } from '../config'
import { activity, expandPath, header1 } from '../util'
import { app } from './app'

export const startMessage = ({ host, port, rootDir }: Config, imageRoot: string) => {
  activity(`server running: http://${host}:${port}`)
  activity(`root directory: ${rootDir}`)
  activity(`image directory: ${imageRoot}`)
}

export const startup = async () => {
  header1('🤖🐻 Bear Markdown API 🐻🤖')
  const config = await loadConfig()
  const {
    bearConfig: { imagePath, rootPath },
  } = config

  // image server
  const imageRoot = `${expandPath(rootPath)}/${imagePath}`
  app.use('/images', express.static(imageRoot))

  const { host, port } = config

  const server = app.listen(port, host, () => startMessage(config, imageRoot))
  server.on('error', (err) => {
    console.error('server error:', err)
    process.exit(1)
  })
}

startup()
