import { loadDatabase } from './database'

export async function noteByUniqueId(noteUniqueId: string) {
  const db = await loadDatabase()
  const { ZTEXT: note } = await db.get(
    `SELECT ZTEXT FROM ZSFNOTE where ZUNIQUEIDENTIFIER='${noteUniqueId}'`
  )
  return { note }
}
