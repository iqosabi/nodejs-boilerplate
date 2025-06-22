import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Extend dulu bro
dayjs.extend(utc)
dayjs.extend(timezone)