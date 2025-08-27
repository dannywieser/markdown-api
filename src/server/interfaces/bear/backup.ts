import path from 'path'

import { loadConfig } from '@/config'
import { backupFile, backupPrune, dateWithHour } from '@/util'

const backupPrefix = 'bear-backup-'
const backupDir = 'bear-backups'
const extension = '.sqlite'

const getBackupFileName = () => `${backupPrefix}${dateWithHour()}${extension}`

/**
 * Backup the Bear Database for safety.
 * This function will create a backup in the root project directory as defined in the configuration.
 * The number of copies kept is defined in the configuration file.
 *
 * This function will also return the full path to the backed up file, as all operations take place against the backup, not the source.
 */
export function backupBearDatabase() {
  const {
    bearConfig: { dbPath, keepBackups },
    rootDir,
  } = loadConfig()
  const destDir = path.join(rootDir, backupDir)
  backupPrune(backupPrefix, destDir, keepBackups)
  return backupFile(dbPath, destDir, getBackupFileName())
}
