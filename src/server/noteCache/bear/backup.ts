import { format } from 'date-fns'
import fs from 'fs'

import { bearDatabase, rootDir } from '@/config'
import { activityWithDetail } from '@/util/logging'

const getBackupFileName = () =>
  `bear-backup-${format(new Date(), 'yyyyMMdd-HH')}.sqlite`

/**
 * Backup the Bear Database for safety.
 * This function will create a backup in the Root Directory.
 * Backups will be deleted based on the "backups" configuration setting - which indicates the number of copies to keep.
 */
export function backupBearDatabase() {
  const destDir = `${rootDir()}/bear-backups`
  const destFile = `${destDir}/${getBackupFileName()}`

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir)
  }
  activityWithDetail('Backing up Bear database', 0, destFile)
  fs.copyFileSync(bearDatabase(), destFile)

  // TODO: cleanup old copies

  return destFile
}
