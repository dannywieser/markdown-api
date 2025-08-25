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
