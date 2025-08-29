import { start, tokenizer } from './tag'

describe('start', () => {
  test('should return index of hashtag', () => {
    expect(start('foo #bar baz')).toBe(4)
  })

  test('should return undefined if no hashtag', () => {
    expect(start('foo bar baz')).toBeUndefined()
  })
})

describe('tokenizer', () => {
  test('should tokenize a hashtag', () => {
    const result = tokenizer('#hello world')
    expect(result).toEqual({
      raw: '#hello',
      text: 'hello',
      type: 'hashtag',
    })
  })

  test('should return undefined if no hashtag', () => {
    expect(tokenizer('hello world')).toBeUndefined()
  })

  test('should tokenize hashtag at end of string', () => {
    const result = tokenizer('foo #bar')
    expect(result).toEqual({
      raw: '#bar',
      text: 'bar',
      type: 'hashtag',
    })
  })

  test('should not match multiple hashtags in one call', () => {
    const result = tokenizer('#foo #bar')
    expect(result).toEqual({
      raw: '#foo',
      text: 'foo',
      type: 'hashtag',
    })
  })

  test('should match tags with forward slashes', () => {
    const result = tokenizer('#foo/bar/baz')
    expect(result).toEqual({
      raw: '#foo/bar/baz',
      text: 'foo/bar/baz',
      type: 'hashtag',
    })
  })

  test('should match tags with dashes', () => {
    const result = tokenizer('#foo-bar-baz')
    expect(result).toEqual({
      raw: '#foo-bar-baz',
      text: 'foo-bar-baz',
      type: 'hashtag',
    })
  })

  test('should not match hashtag with space after #', () => {
    expect(tokenizer('# bar')).toBeUndefined()
  })
})
