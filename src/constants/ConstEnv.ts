export const APP_NAME = process.env.APP_NAME ?? "Restful API PokeAPI"
export const APP_PORT = process.env.PORT ?? 8000
export const BASE_URL = process.env.BASE_URL ?? `http://localhost:${APP_PORT}`

export const POKE_API_URL = process.env.POKE_API_URL ?? 'https://pokeapi.co/api/v2'

export const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN ?? 'fahmidytRestfulAccessToken'
export const JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN ?? 'fahmidytRestfulRefreshToken'