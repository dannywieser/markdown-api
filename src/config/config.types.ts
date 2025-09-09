import { MarkdownNoteSource } from '../types'

export interface BearConfig {
  dbPath: string
  keepBackups: number
}

export interface Config {
  bearConfig: BearConfig
  host: string
  mode: MarkdownNoteSource
  port: number
  rootDir: string
}
