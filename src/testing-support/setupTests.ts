jest.mock('../config', () => ({
  loadConfig: jest.fn(() => ({
    apiRoot: '/api',
    bearConfig: {
      dbFile: 'dbfile.sqlite',
      imagePath: 'images/',
      keepBackups: 5,
      openInBearUrl: 'path/in/bear?id=',
      rootPath: '/path/to/bear',
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
