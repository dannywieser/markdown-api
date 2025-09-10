#!/usr/bin/env node

import express from 'express'
import path from 'path'

import { Config, loadConfig } from '../config'
import { expandPath } from '../util'
import { activity, header1 } from '../util/logging'
import { app } from './app'

export const startMessage = ({ host, port, rootDir }: Config, imageRoot: string) => {
  activity(`server running: http://${host}:${port}`)
  activity(`root directory: ${rootDir}`)
  activity(`images directory: ${imageRoot}`)
}

export const startup = async () => {
  header1('🤖🐻 Bear Markdown API 🐻🤖')
  const config = await loadConfig()
  const {
    bearConfig: { imagePath, rootPath },
  } = config

  // image server
  // TODO: how to organize this?
  const imageRoot = path.join(expandPath(rootPath), imagePath)
  app.use('/images', express.static(imageRoot))

  const { host, port } = config

  const server = app.listen(port, host, () => startMessage(config, imageRoot))
  server.on('error', (err) => {
    console.error('server error:', err)
    process.exit(1)
  })
}

startup()
