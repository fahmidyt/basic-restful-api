import { NextFunction, Request, Response } from 'express'
import ResponseError from '../modules/Response/ResponseError'

function generateErrorResponseError(e: Error, code: Number) {
  return typeof e.message === 'object' ? e.message : { code, message: e.message }
}

async function ErrorResponse(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ResponseError.BaseResponse) {
    return res
      .status(err.statusCode)
      .json(generateErrorResponseError(err, err.statusCode))
  }
  next(err)
}

export default ErrorResponse
