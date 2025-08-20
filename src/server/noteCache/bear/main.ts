import { open } from 'sqlite'
import * as sqlite3 from 'sqlite3'

import { backupBearDatabase } from './backup'

const driver = sqlite3.Database
const sqliteOpen = async (filename: string) => open({ driver, filename })

const loadDatabase = async () => {
  const backupFile = backupBearDatabase()
  return await sqliteOpen(backupFile)
}

export async function noteByUniqueId(noteUniqueId: string) {
  const db = await loadDatabase()
  const { ZTEXT: note } = await db.get(
    `SELECT ZTEXT FROM ZSFNOTE where ZUNIQUEIDENTIFIER='${noteUniqueId}'`
  )
  return { note }
}
