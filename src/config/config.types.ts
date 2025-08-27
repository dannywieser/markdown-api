export interface BearConfig {
  dbPath: string
  keepBackups: number
}

export interface Config {
  bearConfig: BearConfig
  fileConfig: FileConfig
  mode: 'bear' | 'file'
  rootDir: string
}

export interface FileConfig {
  directory: string
}
