import path from 'path'
import { open } from 'sqlite'
import * as sqlite3 from 'sqlite3'

import { Config } from '../../../config'
import { backupFile, backupPrune, createDir, dateWithHour, expandPath } from '../../../util'

const backupPrefix = 'bear-backup-'
const backupDir = 'bear-backups'
const extension = '.sqlite'
const getBackupFileName = () => `${backupPrefix}${dateWithHour()}${extension}`

export function backupBearDatabase({ bearConfig, rootDir }: Config) {
  const dbPath = expandPath(bearConfig?.dbPath ?? '')
  const keepBackups = bearConfig?.keepBackups ?? 0
  const destDir = path.join(rootDir, backupDir)
  createDir(destDir)
  backupPrune(backupPrefix, destDir, keepBackups)
  return dbPath ? backupFile(dbPath, destDir, getBackupFileName()) : null
}

const driver = sqlite3.Database
const sqliteOpen = async (filename: string) => open({ driver, filename })

export const loadDatabase = async (dbPath: string) => await sqliteOpen(dbPath)
