import fs from 'fs'
import path from 'path'

import { activity } from './logging'

/**
 * Backup a file given a sourceFile and destination directory and filename.
 * The destination directory is created if it does not exist.
 */
export function backupFile(
  sourceFile: string,
  targetDir: string,
  targetFile: string
) {
  if (!fs.existsSync(sourceFile)) {
    throw Error(`source file ${sourceFile} does not exist`)
  }
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  const target = path.join(targetDir, targetFile)
  activity(`backup: ${sourceFile} -> ${target}`, 2)
  fs.copyFileSync(sourceFile, target)

  return target
}

/**
 * Removes old backup files from the specified directory, keeping only the newest N copies.
 *
 * Backup files are identified by their prefix and extension.
 */
export function backupPrune(
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
    activity(`pruning: ${file.name}`, 2)
    fs.unlinkSync(path.join(backupDir, file.name))
  }
}
