import type { Request, Response, NextFunction } from 'express'
import type { IncomingHttpHeaders } from 'http'
import jwt, {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken'
import { JWT_SECRET_ACCESS_TOKEN } from '../constants/ConstEnv'
import ResponseError from '../modules/ResponseError'
import AsyncHandler from '../wrapper/AsyncHandler'

const FIRST_PART_JWT = ['Bearer', 'JWT']

function extractToken(headers: IncomingHttpHeaders): string | null {
  // check key authorization
  if (headers && headers.authorization) {
    // split part of authorization token
    const parted = headers.authorization.split(' ')
    if (parted.length !== 2) return null
    if (!FIRST_PART_JWT.includes(parted[0])) return null

    return parted[1]
  }

  return null
}

function verifyToken(token: string) {
  try {
    const data = jwt.verify(token, JWT_SECRET_ACCESS_TOKEN)
    console.log(data)
    return data
  } catch (err) {
    if (err instanceof TokenExpiredError) 
      throw new ResponseError.Unauthorized(`Your token expired. ${err.message}`)

    if (err instanceof JsonWebTokenError || err instanceof NotBeforeError) 
      throw new ResponseError.Unauthorized(`Token error: ${err.message}`)

    console.error('[ERROR]: Unknown authorized error. Payload: ', err)
    throw new ResponseError.Unauthorized("Have something problem with your token")
  }
}

async function Authorization(req: Request, res: Response, next: NextFunction) {
  // get token from headers
  const token = extractToken(req.headers)
  if (!token)
    throw new ResponseError.Unauthorized('Please provide your JWT Token.')

  // to have this, we need setup our request state.
  verifyToken(token)

  return next()
}

export default AsyncHandler(Authorization)
