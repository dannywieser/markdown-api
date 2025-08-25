import os from 'os'
import path from 'path'

/**
 * Given a file path, will expand a ~ home directory shortcut (if present).
 */
export const expandPath = (userPath: string): string =>
  userPath.startsWith('~')
    ? path.join(os.homedir(), userPath.slice(1).replace(/^\/+/, ''))
    : userPath
