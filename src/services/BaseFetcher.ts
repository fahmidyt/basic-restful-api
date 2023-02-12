import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import ResponseError from '../modules/Response/ResponseError'

export function errorHandler(status: number, msg: string) {
  if (status === 400) {
    throw new ResponseError.BadRequest(msg)
  } else if (status === 401) {
    throw new ResponseError.Unauthorized(msg)
  } else if (status === 403) {
    throw new ResponseError.Forbidden(msg)
  } else if (status === 404) {
    throw new ResponseError.NotFound(msg)
  } else {
    throw new ResponseError.InternalServer(msg)
  }
}

function createAuthAxios(baseURL: string): AxiosInstance {
  const instanceAxios = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  instanceAxios.interceptors.response.use(
    function onSuccess(response: AxiosResponse) {
      return response
    },
    function onError(error: AxiosError<any>) {
      /**
       * Handle Axios Error Here
       */
      const err: string =
        error?.response?.data?.message ||
        'Sesuatu telah terjadi. Harap menghubungi Admin'
      const status: number = error?.response?.status || 500

      return errorHandler(status, err)
    }
  )

  return instanceAxios
}

const BaseFetcher = {
  createAuthAxios,
}

export default BaseFetcher
