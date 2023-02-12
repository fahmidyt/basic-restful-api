import { AxiosInstance } from 'axios'
import { POKE_API_URL } from '../constants/ConstEnv'
import BaseFetcher from './BaseFetcher'

class BaseApiCall {
  public readonly PokeApi: AxiosInstance

  constructor() {
    this.PokeApi = BaseFetcher.createAuthAxios(POKE_API_URL)
  }
}

const ApiCall = new BaseApiCall()
export default ApiCall