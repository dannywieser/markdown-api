import { MarkdownNoteSource } from '@/server/interfaces/interfaces.types'

export interface BearConfig {
  dbPath: string
  keepBackups: number
}

export interface Config {
  bearConfig: BearConfig
  fileConfig: FileConfig
  host: string
  mode: MarkdownNoteSource
  port: number
  rootDir: string
}

export interface FileConfig {
  directory: string
}
