import { format } from 'date-fns'

import { dateWithHour } from './date'

jest.mock('date-fns', () => ({
  format: jest.fn(() => '20240101-11'),
}))

test('returns formatted date string as yyyyMMdd-HH', () => {
  const result = dateWithHour()
  expect(format).toHaveBeenCalledWith(expect.any(Date), 'yyyyMMdd-HH')
  expect(result).toBe('20240101-11')
})

import { convertDate } from './date'

describe('convertDate', () => {
  test('converts a Bear Cocoa Core Date string to a Date object', () => {
    // Example Bear date: '0' should be the offset
    const result = convertDate('0')
    expect(result.getTime()).toBe(978307200000)
  })

  test('converts a positive Bear date string correctly', () => {
    // 1 second after offset
    const result = convertDate('1')
    expect(result.getTime()).toBe(978307201000)
  })

  test('converts a negative Bear date string correctly', () => {
    // 1 second before offset
    const result = convertDate('-1')
    expect(result.getTime()).toBe(978307199000)
  })

  test('handles fractional seconds', () => {
    const result = convertDate('1.5')
    expect(result.getTime()).toBe(978307201500)
  })

  test('returns an invalid date for non-numeric input', () => {
    const result = convertDate('not-a-number')
    expect(result instanceof Date).toBe(true)
    expect(isNaN(result.getTime())).toBe(true)
  })
})
