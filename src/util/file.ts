import fs from 'fs'
import fsPromise from 'fs/promises'
import os from 'os'
import path from 'path'

import { activity } from './logging'

const HOMEDIR_ALIAS = '~'
export const expandPath = (userPath: string): string =>
  userPath.startsWith(HOMEDIR_ALIAS)
    ? path.join(os.homedir(), userPath.slice(1).replace(/^\/+/, ''))
    : userPath

export const readFile = async (filePath: string) => {
  activity(`readFile: ${filePath}`)
  try {
    const fileContent = await fsPromise.readFile(filePath, 'utf-8')
    return fileContent
  } catch (err: unknown) {
    if (isNotFoundError(err)) {
      return null
    }
    throw err
  }
}

export const isNotFoundError = (err: unknown) =>
  typeof err === 'object' &&
  err !== null &&
  'code' in err &&
  (err as { code?: string }).code === 'ENOENT'

export const createDir = (destDir: string) => {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }
}

export const createFile = (filePath: string, fileContent: unknown, mode: fs.Mode = 0o600) =>
  fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), { mode })
export const readJSONFile = (filePath: string) => JSON.parse(fs.readFileSync(filePath, 'utf-8'))
export const fileExists = (filePath: string) => fs.existsSync(filePath)
