import fs from 'fs'
import path from 'path'

import { activity } from './logging'

/**
 * Backup a file given a sourceFile and destination directory and filename.
 * The destination directory is created if it does not exist.
 */
export function backupFile(
  sourceFile: string,
  destDir: string,
  destFile: string
) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir)
  }
  activity(`backup: ${sourceFile} -> ${destFile}`, 2)
  fs.copyFileSync(sourceFile, destFile)

  return destFile
}

/**
 * Removes old backup files from the specified directory, keeping only the newest N copies.
 *
 * Backup files are identified by their prefix and extension.
 */
export function cleanBackups(
  backupPrefix: string,
  backupDir: string,
  keep: number
) {
  const files = fs
    .readdirSync(backupDir)
    .filter((f) => f.startsWith(backupPrefix))
    .map((f) => ({
      name: f,
      time: fs.statSync(path.join(backupDir, f)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time)

  const filesToDelete = files.slice(keep)
  for (const file of filesToDelete) {
    activity(`cleaning extra backup: ${file.name}`, 2)
    fs.unlinkSync(path.join(backupDir, file.name))
  }
}
