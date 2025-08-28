import fs from 'fs/promises'
import os from 'os'
import path from 'path'

import { activity } from './logging'

/**
 * Given a file path, will expand a ~ home directory shortcut (if present).
 */
export const expandPath = (userPath: string): string =>
  userPath.startsWith('~')
    ? path.join(os.homedir(), userPath.slice(1).replace(/^\/+/, ''))
    : userPath

export const readFile = async (filePath: string) => {
  activity(`readFile: ${filePath}`)
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
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
