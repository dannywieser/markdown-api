export interface BearConfig {
  appDataRoot: string
  dbFile: string
  imageRoot: string
  openInBearUrl: string
}

export interface Config {
  apiUriRoot: string
  backups: number
  bearConfig: BearConfig
  host: string
  imageUriRoot: string
  noteWebPath: string
  port: number
  rootDir: string
}
