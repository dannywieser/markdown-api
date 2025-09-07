import {
  activity,
  createDir,
  createFile,
  expandPath,
  fileExists,
  header1,
  readJSONFile,
} from '../util'
import { Config } from './config.types'
import { promptForConfig } from './prompts'

const CONFIG_FILENAME = '~/.markdown-api.json'
const host = '0.0.0.0'
const port = 4040
const dbPath =
  '~/Library/Group Containers/9K33E3U3T4.net.shinyfrog.bear/Application Data/database.sqlite'
const keepBackups = 5

export async function loadConfig(): Promise<Config> {
  const configPath = expandPath(CONFIG_FILENAME)
  if (!fileExists(configPath)) {
    header1(
      "Welcome to markdown-api!\n\nLet's setup the configuration for your local markdown notes.\n\n"
    )
    const { fileDirectory, mode, rootDir } = await promptForConfig()

    // create the root directory
    const resolvedRootDir = expandPath(rootDir)
    createDir(resolvedRootDir)

    // finalize config
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

    // write config file
    createFile(configPath, finalConfig)
    activity(`Created configuration at ${configPath}`)
    return finalConfig
  } else {
    const config = readJSONFile(configPath)
    return config
  }
}
