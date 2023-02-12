import * as yup from 'yup'

export type SortType = {
  // since pokeapi only had property 'name' to be sorted
  key: 'name'
  desc: boolean
}

export type FilterType = {
  // since pokeapi only had property 'name' to be filtered
  key: 'name'
  value: string
}

interface QueryProps {
  page?: number
  pageSize?: number
  sort?: SortType[]
  filter?: FilterType[]
}

const sortValidation: yup.ObjectSchema<SortType> = yup
  .object({
    key: yup.string<'name'>().oneOf(["name"]).required(),
    desc: yup.boolean().required(),
  })
  .required()

const filterValidation: yup.ObjectSchema<FilterType> = yup
  .object({
    key: yup.string<'name'>().oneOf(["name"]).required(),
    value: yup.string().required(),
  })
  .required()

const queryValidation: yup.ObjectSchema<QueryProps> = yup
  .object({
    page: yup.number().optional(),
    pageSize: yup.number().optional(),
    sort: yup
      .array(sortValidation)
      .transform((value) => {
        try {
          if (typeof value === 'string') return JSON.parse(value)

          return value
        } catch (err) {
          return value
        }
      })
      .optional(),
    filter: yup
      .array(filterValidation)
      .transform((value) => {
        try {
          if (typeof value === 'string') return JSON.parse(value)

          return value
        } catch (err) {
          return value
        }
      })
      .optional(),
  })
  .required()

export { sortValidation, filterValidation, queryValidation }
