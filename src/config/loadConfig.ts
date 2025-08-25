import { expandPath } from '@/util/file'

import config from './config.json'
import { Config } from './config.types'

export const rootDir = () => expandPath(config.rootDirectory)
export const bearDatabase = () => expandPath(config.bearDatabase)

export function loadConfig(): Config {
  const keepBackups = config.keepBackups ?? 5
  return {
    ...config,
    bearDatabase: bearDatabase(),
    keepBackups,
    rootDir: rootDir(),
  }
}
