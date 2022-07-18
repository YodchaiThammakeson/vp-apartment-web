import _ from 'lodash'

import moment from 'utils/moment'

export const convertDayCodeToTargetDate = (code) => {
  if (!code) return null

  const now = moment()

  if (code === 'TDY') {
    return now
  }

  const codeFirstTwo = code.substring(0, 2)
  const day = Number(_.replace(code, codeFirstTwo, ''))

  if (codeFirstTwo === 'TM') {
    return now.subtract(day, 'day')
  }

  if (codeFirstTwo === 'TP') {
    return now.add(day, 'day')
  }

  return null
}
