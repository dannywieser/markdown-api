import { format } from 'date-fns'

export const dateWithHour = () => format(new Date(), 'yyyyMMdd-HH')
