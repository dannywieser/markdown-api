import { createDir, createFile, expandPath, fileExists, readJSONFile } from '../util'
import defaultConfig from './config.default.json'
import { Config } from './config.types'

export async function loadConfig(): Promise<Config> {
  const rootDir = expandPath('~/.bear-markdown-api')
  const configPath = `${rootDir}/config.json`
  if (!fileExists(configPath)) {
    createDir(rootDir)
    createFile(configPath, defaultConfig)
    return defaultConfig
  } else {
    const config = readJSONFile(configPath)
    return config
  }
}
