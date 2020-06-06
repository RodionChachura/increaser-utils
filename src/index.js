const { DateTime } = require('luxon')

const S_IN_MIN = 60
const H_IN_DAY = 24
const D_IN_WEEK = 7
const S_IN_HOUR = S_IN_MIN * S_IN_MIN
const H_IN_WEEK = H_IN_DAY * D_IN_WEEK
const MIN_IN_HOUR = 60

const MS_IN_SEC = 1000
const MS_IN_MIN = S_IN_MIN * MS_IN_SEC
const MS_IN_HOUR = S_IN_MIN * MS_IN_MIN
const MS_IN_DAY = H_IN_DAY * MS_IN_HOUR
const MS_IN_WEEK = 7 * MS_IN_DAY

const getShortHour = hour => hour % 12 || 12

const getAMorPM = hour => (hour >= 12 ? 'PM' : 'AM')
class OffsetedUtils {
  constructor(offset = null) {
    this.offset = offset
  }

  setOffset(newOffset) {
    this.offset = newOffset
  }

  getRealOffset() {
    return new Date().getTimezoneOffset()
  }

  getOffset() {
    return this.offset === null ? this.getRealOffset() : this.offset
  }

  getOffsetDiff() {
    return this.getRealOffset() - this.getOffset()
  }

  withOffset(dateTime) {
    return dateTime.toUTC(-this.getOffset())
  }

  getLocal(...args) {
    return this.withOffset(DateTime.local(...args))
  }

  toTime(timestamp) {
    return this.withOffset(DateTime.fromMillis(timestamp).toLocal())
  }

  getPeriodSets(period, sets) {
    const now = this.getLocal()
    return sets.filter(({ start }) => now.hasSame(this.toTime(start), period))
  }

  getTodaySets(sets) {
    return this.getPeriodSets('day', sets)
  }

  getWeekSets(sets) {
    return this.getPeriodSets('week', sets)
  }

  getHumanTime() {
    const date = this.getLocal()
    let hours = date.hour
    let minutes = date.minute
    if (minutes === S_IN_MIN) {
      minutes = 0
      hours += 1
    }
    const minuteView = minutes < 10 ? `0${minutes}` : minutes

    return `${getShortHour(hours)}:${minuteView} ${getAMorPM(hours)}`
  }

  getHumanPaddleDate(string) {
    const [year, month, day] = string.split('-').map(Number)
    const date = this.getLocal(year, month, day)
    return date.toLocaleString(DateTime.DATE_FULL)
  }

  
  getWeekday(date) {
    return (date || this.getLocal()).weekday
  }

  getYear() {
    return this.getLocal().year
  }

  getWeekYear() {
    return this.getLocal().weekYear
  }

  getMonth() {
    return this.getLocal().month
  } 

  getDay() {
    return this.getLocal().day
  }

  getWeekNumber() {
    return this.getLocal().weekNumber
  }

  getTodayStartDate() {
    return this.withOffset(this.getLocal(this.getYear(), this.getMonth(), this.getDay(), 0, 0, 0, 0))
  }
    
  getWeeksNumberInYear(year) {
    return this.getLocal(year).weeksInWeekYear
  }

  getTodayStart() {
    return this.getTodayStartDate().valueOf()
  }

  getTodayEnd() {
    return this.getTodayStartDate()
      .plus({ days: 1 })
      .valueOf()
  }

  getWeekEnd() {
    return this.getTodayStartDate()
      .plus({ days: 8 - this.getWeekday() })
      .valueOf()
  }

  getWeekStartDate() {
    return this.getTodayStartDate().minus({ days: this.getWeekday() - 1 })
  }

  getWeekStart() {
    return this.getWeekStartDate().valueOf()
  }
  
  getWeekStartInSec() {
    return this.getWeekStart() / MS_IN_SEC
  }
}

module.exports = {
  S_IN_MIN,
  H_IN_DAY,
  D_IN_WEEK,
  S_IN_HOUR,
  H_IN_WEEK,
  MIN_IN_HOUR,

  MS_IN_SEC,
  MS_IN_MIN,
  MS_IN_HOUR,
  MS_IN_DAY,
  MS_IN_WEEK,

  OffsetedUtils,

  getShortHour,
  getAMorPM
}
