import { MarkdownNoteSource } from '../types'

export interface BearConfig {
  dbPath: string
  keepBackups: number
  openInBearUrl: string
}

export interface Config {
  apiRoot: string
  bearConfig: BearConfig
  host: string
  mode: MarkdownNoteSource
  noteWebPath: string
  port: number
  rootDir: string
}
