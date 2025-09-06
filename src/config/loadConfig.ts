import fs from 'fs'
import inquirer from 'inquirer'
import os from 'os'
import path from 'path'

import { activity, expandPath } from '../util'
import { Config } from './config.types'

const CONFIG_FILENAME = '.markdown-api.json'
const host = '0.0.0.0'
const port = 4040
const dbPath =
  '~/Library/Group Containers/9K33E3U3T4.net.shinyfrog.bear/Application Data/database.sqlite'
const keepBackups = 5

async function promptForConfig() {
  const answers = await inquirer.prompt([
    {
      default: '~/markdown-api',
      message:
        'Markdown API needs a directory where it will store cached versions of files for serving - please input a location for this directory:',
      name: 'rootDir',
      type: 'input',
    },
    {
      choices: ['bear', 'obsidian'],
      default: 'bear',
      message: 'What app do you use to create your notes?',
      name: 'mode',
      type: 'list',
    },
    {
      message: 'What directory is your Obsidian Vault saved in?',
      name: 'fileDirectory',
      type: 'input',
      when: (answers) => answers.mode === 'obsidian',
    },
  ])
  return answers
}

const configPath = path.join(os.homedir(), CONFIG_FILENAME)

export async function loadConfig(): Promise<Config> {
  if (!fs.existsSync(configPath)) {
    console.log(
      "Welcome to markdown-api!\n\nLet's setup the configuration for your local markdown notes.\n\n"
    )
    const { fileDirectory, mode, rootDir } = await promptForConfig()
    // Expand ~ to home directory
    const resolvedRootDir = expandPath(rootDir)
    // Create the directory if it does not exist
    if (!fs.existsSync(resolvedRootDir)) {
      fs.mkdirSync(resolvedRootDir, { recursive: true })
    }
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
    console.log(`Created configuration at ${configPath}`)
    return finalConfig
  } else {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    return config
  }
}
