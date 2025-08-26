import { expandPath } from './file'

jest.mock('os', () => ({
  homedir: jest.fn(() => '/mock/home'),
}))
jest.mock('path', () => ({
  join: jest.fn((...args: string[]) => args.join('/')),
}))

describe('expandPath', () => {
  test('expands ~ to home directory', () => {
    expect(expandPath('~/documents')).toBe('/mock/home/documents')
  })

  test('removes double forward slashes', () => {
    expect(expandPath('~//documents')).toBe('/mock/home/documents')
  })

  test('returns path unchanged if no ~', () => {
    expect(expandPath('/some/other/path')).toBe('/some/other/path')
  })
})
