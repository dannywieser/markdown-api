import { format } from 'date-fns'

export const dateWithHour = () => format(new Date(), 'yyyyMMdd-HH')

const COCOA_CORE_DATE_OFFSET = 978_307_200_000
// Dates for Bear are saved as a Cocoa Core Date. This function converts that date into epoch.
export const convertDate = (bearDate: string): Date => {
  const epochMs = parseFloat(bearDate) * 1000 + COCOA_CORE_DATE_OFFSET
  return new Date(epochMs)
}
