export interface BearConfig {
  dbPath: string
  keepBackups: number
}

export interface Config {
  bearConfig: BearConfig
  fileConfig: FileConfig
  host: string
  mode: 'bear' | 'file'
  port: number
  rootDir: string
}

export interface FileConfig {
  directory: string
}
