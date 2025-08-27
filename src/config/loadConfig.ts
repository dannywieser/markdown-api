import { expandPath } from '@/util'

import config from './config.json'
import { Config } from './config.types'

export function loadConfig(): Config {
  const { bearConfig, fileConfig, rootDir } = config as Config
  const { dbPath, keepBackups = 5 } = bearConfig
  const { directory } = fileConfig
  return {
    ...config,
    bearConfig: { dbPath: expandPath(dbPath), keepBackups },
    fileConfig: { directory: expandPath(directory) },
    rootDir: expandPath(rootDir),
  }
}
