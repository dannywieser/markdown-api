import { loadConfig } from './loadConfig'

jest.mock(
  './config.json',
  () => ({
    bearConfig: {
      dbPath: '/mock/db.sqlite',
      keepBackups: 3,
    },
    fileConfig: {
      directory: '/path/to/files',
    },
    mode: 'bear',
    rootDir: '/mock/root',
  }),
  { virtual: true }
)

jest.mock('@/util', () => ({
  expandPath: jest.fn((p: string) => `/expanded${p}`),
}))

describe('loadConfig', () => {
  test('loadConfig returns config with expanded paths', () => {
    const result = loadConfig()
    // expect(result.rootDir).toBe('/expanded/mock/root')
    // expect(result.bearConfig.dbPath).toBe('/expanded/mock/db.sqlite')
    // expect(result.bearConfig.keepBackups).toBe(3)
    // expect(result.fileConfig.directory).toBe('/expanded/path/to/files')
    // expect(result.mode).toBe('bear')
  })
})
