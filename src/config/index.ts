import os from 'os'
import path from 'path'

export const config = {
  backups: 5,
  bearDatabase:
    '~/Library/Group Containers/9K33E3U3T4.net.shinyfrog.bear/Application Data/database.sqlite',
  rootDirectory: '~/markdown-memory',
}

const expandPath = (userPath: string): string =>
  userPath.startsWith('~')
    ? path.join(os.homedir(), userPath.slice(1))
    : userPath

export const rootDir = () => expandPath(config.rootDirectory)
export const bearDatabase = () => expandPath(config.bearDatabase)
