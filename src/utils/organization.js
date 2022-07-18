import _ from 'lodash'

const orgFilterList = [
  'company_id',
  'group_id',
  'bu_id',
  'division_id',
  'department_id',
  'section_id',
]

export const convertOrganizationalStructureToFilters = (items, array) => {
  let result = {}

  _.forEach(items, (item) => {
    const valueArray = _.split(item, '-')

    _.forEach(valueArray, (id, index) => {
      const orgFilterKey = array ? array[index] : orgFilterList[index]

      result[orgFilterKey] = _.uniq([...(result[orgFilterKey] || []), id])
    })
  })

  return result
}
