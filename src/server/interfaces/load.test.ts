import { MarkdownNoteSource } from './interfaces.types'
import { loadInterface } from './load'

jest.mock('./bear/main', () => ({
  mode: 'bear',
}))
describe('markdown interface loading', () => {
  test('returns bear mode interface', () => {
    const mode = loadInterface('bear')
    expect(mode).toEqual({ default: { mode: 'bear' }, mode: 'bear' })
  })
  test('throws if the mode is invalid', () => {
    expect(() => loadInterface('foo' as MarkdownNoteSource)).toThrow('invalid mode: foo')
  })
})
