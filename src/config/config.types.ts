import { MarkdownNoteSource } from '../server/interfaces/interfaces.types'

export interface BearConfig {
  dbPath: string
  keepBackups: number
}

export interface Config {
  bearConfig: BearConfig | undefined
  fileConfig: FileConfig | undefined
  host: string
  mode: MarkdownNoteSource
  port: number
  rootDir: string
}
export interface FileConfig {
  directory: string
}
