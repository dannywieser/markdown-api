import { start, tokenizer } from './highlight'

describe('highlight tokenizer', () => {
  test('tokenize yellow highlight by default', () => {
    const src = '==🟡highlighted text=='
    const result = tokenizer(src)
    expect(result).toEqual({
      color: 'yellow',
      raw: '==🟡highlighted text==',
      text: 'highlighted text',
      type: 'highlight',
    })
  })

  test('tokenize red highlight', () => {
    const src = '==🔴important=='
    const result = tokenizer(src)
    expect(result).toEqual({
      color: 'red',
      raw: '==🔴important==',
      text: 'important',
      type: 'highlight',
    })
  })

  test('tokenize blue highlight', () => {
    const src = '==🔵note=='
    const result = tokenizer(src)
    expect(result).toEqual({
      color: 'blue',
      raw: '==🔵note==',
      text: 'note',
      type: 'highlight',
    })
  })

  test('tokenize green highlight', () => {
    const src = '==🟢success=='
    const result = tokenizer(src)
    expect(result).toEqual({
      color: 'green',
      raw: '==🟢success==',
      text: 'success',
      type: 'highlight',
    })
  })

  test('tokenize purple highlight', () => {
    const src = '==🟣tip=='
    const result = tokenizer(src)
    expect(result).toEqual({
      color: 'purple',
      raw: '==🟣tip==',
      text: 'tip',
      type: 'highlight',
    })
  })

  test('default to yellow for unknown emoji', () => {
    const src = '==💩oops=='
    const result = tokenizer(src)
    expect(result).toEqual({
      color: 'yellow',
      raw: '==💩oops==',
      text: 'oops',
      type: 'highlight',
    })
  })

  test('should return undefined for non-highlighted text', () => {
    const src = 'no highlight here'
    const result = tokenizer(src)
    expect(result).toBeUndefined()
  })

  test('should return undefined for incomplete highlight syntax', () => {
    const src = '==🟡missing end'
    const result = tokenizer(src)
    expect(result).toBeUndefined()
  })

  // Tests for start() function

  describe('highlight start', () => {
    test('returns index of match for valid highlight', () => {
      const src = 'Some text ==🟡highlight== more text'
      const index = start(src)
      expect(index).toBe(10)
    })

    test('returns undefined for no highlight', () => {
      const src = 'No highlight here'
      const index = start(src)
      expect(index).toBeUndefined()
    })

    test('returns undefined for incomplete highlight', () => {
      const src = '==🟡missing end'
      const index = start(src)
      expect(index).toBeUndefined()
    })
  })
})
