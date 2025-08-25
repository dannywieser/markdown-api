import { bearDatabase, loadConfig, rootDir } from './loadConfig'

jest.mock(
  './config.json',
  () => ({
    bearDatabase: '/mock/db.sqlite',
    keepBackups: 3,
    otherSetting: 'value',
    rootDirectory: '/mock/root',
  }),
  { virtual: true }
)

jest.mock('@/util', () => ({
  expandPath: jest.fn((p: string) => `/expanded${p}`),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('loadConfig', () => {
  test('rootDir returns expanded root directory', () => {
    expect(rootDir()).toBe('/expanded/mock/root')
  })

  test('bearDatabase returns expanded bear database path', () => {
    expect(bearDatabase()).toBe('/expanded/mock/db.sqlite')
  })

  test('loadConfig returns config with expanded paths and keepBackups', () => {
    const result = loadConfig()
    expect(result.rootDir).toBe('/expanded/mock/root')
    expect(result.bearDatabase).toBe('/expanded/mock/db.sqlite')
    expect(result.keepBackups).toBe(3)
  })
})
