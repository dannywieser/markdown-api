import {
  activity,
  createDir,
  createFile,
  expandPath,
  fileExists,
  header1,
  header2,
  readJSONFile,
} from '../util'
import { Config } from './config.types'
import { promptForConfig } from './prompts'

const CONFIG_FILENAME = '~/.bear-markdown-api.json'
const host = '0.0.0.0'
const port = 4040
const dbPath =
  '~/Library/Group Containers/9K33E3U3T4.net.shinyfrog.bear/Application Data/database.sqlite'
const keepBackups = 5
const mode = 'bear'

export async function loadConfig(): Promise<Config> {
  const configPath = expandPath(CONFIG_FILENAME)
  if (!fileExists(configPath)) {
    header2('Configuration set up')
    const { rootDir } = await promptForConfig()

    const resolvedRootDir = expandPath(rootDir)
    createDir(resolvedRootDir)

    const finalConfig: Config = {
      bearConfig: { dbPath, keepBackups },
      host,
      mode,
      port,
      rootDir: resolvedRootDir,
    }

    createFile(configPath, finalConfig)
    activity(`Created configuration at ${configPath}`)
    return finalConfig
  } else {
    const config = readJSONFile(configPath)
    return config
  }
}
