jest.mock('../config', () => ({
  loadConfig: jest.fn(() => ({
    bearConfig: {
      dbPath: '/path/to/db',
      keepBackups: 5,
    },
    fileConfig: {
      directory: '/dir',
    },
    host: 'hostname',
    mode: 'bear',
    port: 80,
    rootDir: '/mock/root',
  })),
}))
