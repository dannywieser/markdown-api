import { open } from 'sqlite'
import * as sqlite3 from 'sqlite3'

import { backupBearDatabase } from './backup'

const driver = sqlite3.Database
const sqliteOpen = async (filename: string) => open({ driver, filename })

export const loadDatabase = async () => {
  const backupFile = backupBearDatabase()
  return await sqliteOpen(backupFile)
}
