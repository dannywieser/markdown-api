import fs from 'fs'
import os from 'os'
import path from 'path'

import { activity, createDir, expandPath, header1 } from '../util'
import { Config } from './config.types'
import { promptForConfig } from './prompts'

const CONFIG_FILENAME = '.markdown-api.json'
const host = '0.0.0.0'
const port = 4040
const dbPath =
  '~/Library/Group Containers/9K33E3U3T4.net.shinyfrog.bear/Application Data/database.sqlite'
const keepBackups = 5

const configPath = path.join(os.homedir(), CONFIG_FILENAME)

export async function loadConfig(): Promise<Config> {
  if (!fs.existsSync(configPath)) {
    header1(
      "Welcome to markdown-api!\n\nLet's setup the configuration for your local markdown notes.\n\n"
    )
    const { fileDirectory, mode, rootDir } = await promptForConfig()
    const resolvedRootDir = expandPath(rootDir)
    createDir(resolvedRootDir)
    const bearConfig =
      mode === 'bear'
        ? {
            dbPath,
            keepBackups,
          }
        : undefined
    const fileConfig = mode === 'obsidian' ? { directory: fileDirectory } : undefined
    const finalConfig = {
      bearConfig,
      fileConfig,
      host,
      mode,
      port,
      rootDir: resolvedRootDir,
    }
    fs.writeFileSync(configPath, JSON.stringify(finalConfig, null, 2), { mode: 0o600 })
    activity(`Created configuration at ${configPath}`)
    return finalConfig
  } else {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    return config
  }
}
