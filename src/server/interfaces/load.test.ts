import { Config, loadConfig } from '../../config'
import { asMock, mockConfig } from '../../testing-support'
import { loadInterface } from './load'

jest.mock('@/config')
jest.mock('./bear/main', () => ({
  mode: 'bear',
}))
jest.mock('./file/main', () => ({
  mode: 'file',
}))

describe('markdown interface loading', () => {
  // test('returns bear mode interface', () => {
  //   const bearConfig = mockConfig({ mode: 'bear' })
  //   asMock(loadConfig).mockReturnValue(bearConfig)
  //   const mode = loadInterface()
  //   expect(mode).toEqual({ default: { mode: 'bear' }, mode: 'bear' })
  // })
  // test('returns file mode interface', () => {
  //   const fileConfig = mockConfig({ mode: 'file' })
  //   asMock(loadConfig).mockReturnValue(fileConfig)
  //   const mode = loadInterface()
  //   expect(mode).toEqual({ default: { mode: 'file' }, mode: 'file' })
  // })
  // test('throws if the mode is invalid', () => {
  //   const fileConfig = mockConfig({ mode: 'foo' } as unknown as Config)
  //   asMock(loadConfig).mockReturnValue(fileConfig)
  //   expect(() => loadInterface()).toThrow('invalid mode: foo')
  // })
})
