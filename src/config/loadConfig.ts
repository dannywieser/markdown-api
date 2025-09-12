import { createDir, createFile, expandPath, fileExists, readJSONFile } from '../util'
import defaultConfig from './config.default.json'
import { Config } from './config.types'

const rootDir = '~/.bear-markdown-api'

export async function loadConfig(): Promise<Config> {
  const configPath = expandPath(`${rootDir}/config.json`)
  if (!fileExists(configPath)) {
    const resolvedRootDir = expandPath(rootDir)
    createDir(resolvedRootDir)
    createFile(configPath, defaultConfig)
    return defaultConfig
  } else {
    const config = readJSONFile(configPath)
    return config
  }
}
