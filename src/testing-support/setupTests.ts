jest.mock('../config', () => ({
  loadConfig: jest.fn(() => ({
    apiRoot: '/api',
    bearConfig: {
      dbPath: '/path/to/db',
      keepBackups: 5,
      openInBearUrl: 'path/in/bear?id=',
    },
    fileConfig: {
      directory: '/dir',
    },
    host: 'hostname',
    mode: 'bear',
    noteWebPath: '/note',
    port: 80,
    rootDir: '/mock/root',
  })),
}))
