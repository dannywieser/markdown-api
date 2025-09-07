import { MarkdownNoteSource } from './interfaces.types'
import { loadInterface } from './load'

jest.mock('./bear/main', () => ({
  mode: 'bear',
}))
jest.mock('./file/main', () => ({
  mode: 'obsidian',
}))

describe('markdown interface loading', () => {
  test('returns bear mode interface', () => {
    const mode = loadInterface('bear')
    expect(mode).toEqual({ default: { mode: 'bear' }, mode: 'bear' })
  })
  test('returns obsidian mode interface', () => {
    const mode = loadInterface('obsidian')
    expect(mode).toEqual({ default: { mode: 'obsidian' }, mode: 'obsidian' })
  })
  test('throws if the mode is invalid', () => {
    expect(() => loadInterface('foo' as MarkdownNoteSource)).toThrow('invalid mode: foo')
  })
})
