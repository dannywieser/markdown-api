import fs from 'fs/promises'

import { loadConfig } from '@/config'
import { activity } from '@/util'

export async function noteByUniqueId(fileName: string) {
  const {
    fileConfig: { directory },
  } = loadConfig()
  const filePath = `${directory}/${fileName}.md`
  activity(`reading ${filePath}`)
  try {
    const note = await fs.readFile(filePath, 'utf-8')
    return { note }
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code?: string }).code === 'ENOENT'
    ) {
      // File not found
      return null
    }
    throw err // Rethrow other errors
  }
}
