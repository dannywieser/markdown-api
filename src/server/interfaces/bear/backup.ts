import { loadConfig } from '@/config'
import { backupFile, cleanBackups, dateWithHour } from '@/util'

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
  const { bearDatabase, keepBackups, rootDir } = loadConfig()
  const destDir = `${rootDir}/${backupDir}`
  const destFile = `${destDir}/${getBackupFileName()}`

  backupFile(bearDatabase, destDir, destFile)
  cleanBackups(backupPrefix, destDir, keepBackups)

  return destFile
}
