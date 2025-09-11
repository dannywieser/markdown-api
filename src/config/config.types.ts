import { MarkdownNoteSource } from '../types'

export interface BearConfig {
  dbFile: string
  imagePath: string
  keepBackups: number
  openInBearUrl: string
  rootPath: string
}

export interface Config {
  apiRoot: string
  bearConfig: BearConfig
  host: string
  imageRoot: string
  mode: MarkdownNoteSource
  noteWebPath: string
  port: number
  rootDir: string
}
