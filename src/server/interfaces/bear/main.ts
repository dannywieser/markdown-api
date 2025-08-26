import { loadDatabase } from './database'

export async function noteByUniqueId(noteUniqueId: string) {
  const db = await loadDatabase()
  const result = await db.get(
    `SELECT ZTEXT FROM ZSFNOTE where ZUNIQUEIDENTIFIER=?`,
    [noteUniqueId]
  )
  return result ? { note: result.ZTEXT } : undefined
}
