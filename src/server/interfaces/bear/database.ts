import { open } from 'sqlite'
import * as sqlite3 from 'sqlite3'

import { Config } from '../../../config'
import { backupFile, backupPrune, createDir, dateWithHour, expandPath } from '../../../util'

const backupPrefix = 'bear-backup-'
const extension = '.sqlite'
const getBackupFileName = () => `${backupPrefix}${dateWithHour()}${extension}`

export function backupBearDatabase({
  backups,
  bearConfig: { appDataRoot, dbFile },
  rootDir,
}: Config) {
  const dbPath = `${expandPath(appDataRoot)}/${dbFile}`
  createDir(rootDir)
  backupPrune(backupPrefix, rootDir, backups)
  return dbPath ? backupFile(dbPath, rootDir, getBackupFileName()) : null
}

const driver = sqlite3.Database
const sqliteOpen = async (filename: string) => open({ driver, filename })

export const loadDatabase = async (dbPath: string) => await sqliteOpen(dbPath)
