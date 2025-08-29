import path from 'path'
import { Database, open } from 'sqlite'
import * as sqlite3 from 'sqlite3'

import { loadConfig } from '@/config'
import { backupFile, backupPrune, dateWithHour } from '@/util'

const backupPrefix = 'bear-backup-'
const backupDir = 'bear-backups'
const extension = '.sqlite'
const getBackupFileName = () => `${backupPrefix}${dateWithHour()}${extension}`

export function backupBearDatabase() {
  const {
    bearConfig: { dbPath, keepBackups },
    rootDir,
  } = loadConfig()
  const destDir = path.join(rootDir, backupDir)
  backupPrune(backupPrefix, destDir, keepBackups)
  return backupFile(dbPath, destDir, getBackupFileName())
}

const driver = sqlite3.Database
const sqliteOpen = async (filename: string) => open({ driver, filename })

export const loadDatabase = async (dbPath: string) => await sqliteOpen(dbPath)

export const noteByTitle = async (title: string, db: Database) =>
  db.get(`SELECT ZUNIQUEIDENTIFIER FROM ZSFNOTE where ZTITLE=?`, [title])
