import {
  activity,
  createDir,
  createFile,
  expandPath,
  fileExists,
  header2,
  readJSONFile,
} from '../util'
import { Config } from './config.types'
import { promptForConfig } from './prompts'

const CONFIG_FILENAME = '~/.bear-markdown-api.json'
const host = '0.0.0.0'
const port = 4040
const rootPath = '~/Library/Group Containers/9K33E3U3T4.net.shinyfrog.bear/Application Data'
const dbFile = 'database.sqlite'
const imagePath = 'Local Files/Note Images/'
const keepBackups = 5
const mode = 'bear'
const apiRoot = '/api'
const openInBearUrl = 'bear://x-callback-url/open-note?id='
const noteWebPath = '/note'

export async function loadConfig(): Promise<Config> {
  const configPath = expandPath(CONFIG_FILENAME)
  if (!fileExists(configPath)) {
    header2('Configuration set up')
    const { rootDir } = await promptForConfig()

    const resolvedRootDir = expandPath(rootDir)
    createDir(resolvedRootDir)

    const finalConfig: Config = {
      apiRoot,
      bearConfig: { dbFile, imagePath, keepBackups, openInBearUrl, rootPath },
      host,
      mode,
      noteWebPath,
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
