import type { Request } from 'express'
import ApiCall from '../../services/ApiCall'
import { FilterType, queryValidation, SortType } from './schema'

interface Pokemon {
  name: string
  url: string
}

interface PokemonResponse {
  count: number
  next: string
  previous: null
  results: Pokemon[]
}

class PokemonService {
  public static async getAll(req: Request) {
    const { query } = req
    const validatedQuery = queryValidation.validateSync(query, {
      abortEarly: false,
      stripUnknown: true,
    })

    // since pokeapi can't handle our requirment like sorting and filtering
    // especially when sorting combined with pagination
    // it won't work perfectly. 🥲
    // what we gonna do is.. fetch everything all, then do search/pagination/sorting based by that!
    // only problem with this is axios will fetch many data every requested :')
    const res = await ApiCall.PokeApi.get<PokemonResponse>('/pokemon', {
      params: {
        limit: 99999,
        offset: 0,
      },
    })

    let data = res.data.results

    // do your magic here!
    if (validatedQuery.filter) data = this.FilterData(data, validatedQuery.filter)
    if (validatedQuery.sort) data = this.SortData(data, validatedQuery.sort)
    data = this.PaginateData(data, validatedQuery.page, validatedQuery.pageSize)

    return {
      message: 'Successfully get data pokemon!',
      total: res.data.count,
      data
    }
  }

  private static PaginateData(datas: Pokemon[], page: number = 1, pageSize: number = 10) {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    return datas.slice(startIndex, endIndex)
  }

  private static SortData(datas: Pokemon[], sorts: SortType[]) {
    const newDatas = [...datas]

    // foreach every sort of keys
    sorts.forEach((sort) => {
      newDatas.sort((a: Pokemon, b: Pokemon) => {
        if (sort.desc) return b[sort.key].localeCompare(a[sort.key])
        return a[sort.key].localeCompare(b[sort.key])
      })
    })

    return newDatas
  }

  private static FilterData(datas: Pokemon[], filters: FilterType[]) {
    return datas.filter((data) => {
      let flag = true
      filters.forEach((filter) => {
        if (
          !data[filter.key]
            .toLocaleLowerCase()
            .includes(filter.value.toLocaleLowerCase())
        )
          flag = false
      })

      return flag
    })
  }
}

export default PokemonService
