import * as logging from './logging'

beforeEach(() => {
  jest.spyOn(console, 'info').mockImplementation(() => {})
})

afterEach(() => {
  jest.restoreAllMocks()
})

test('header1 logs formatted header with single hash', () => {
  logging.header1('Test Header')
  expect(console.info).toHaveBeenCalledWith(expect.stringContaining('# Test Header'))
})

test('header2 logs formatted header with double hash', () => {
  logging.header2('Test Header')
  expect(console.info).toHaveBeenCalledWith(expect.stringContaining('## Test Header'))
})

test('activity logs activity text with indent', () => {
  logging.activity('Doing something', 3)
  expect(console.info).toHaveBeenCalledWith('... Doing something')
})

test('activity logs activity text with default indent', () => {
  logging.activity('Doing something')
  expect(console.info).toHaveBeenCalledWith(' Doing something')
})

test('activityWithDetail logs activity and detail with indent', () => {
  logging.activityWithDetail('Main activity', 2, 'Extra detail')
  expect(console.info).toHaveBeenCalledWith('.. Main activity\n .... Extra detail')
})
