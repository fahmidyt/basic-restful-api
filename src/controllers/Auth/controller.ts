import express, { Request, Response, NextFunction } from 'express'
import BuildResponse from '../../modules/BuildResponse'
import AsyncHandler from '../../wrapper/AsyncHandler'
import Service from './service'
import { payloadValidation } from './schema'

const router = express.Router()

const AuthService = new Service()

router.post(
  '/sign-in',
  AsyncHandler(async function signIn(
    req: Request,
    res: Response
  ): Promise<any> {
    const payload = payloadValidation.validateSync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    const data = AuthService.login(payload)
    const buildResponse = BuildResponse.get(data)

    // cookie will expired in 1 hr
    const expires = new Date()
    expires.setHours(expires.getHours() + 1)

    // im setting the cookie, but no use in this project
    // because i dont really check the cookie instead by the header :P
    // but i'll set anyway
    return res
      .cookie('token', data.accessToken, {
        expires,
        path: '/v1',
      })
      .json(buildResponse)
  })
)

router.post(
  '/sign-up',
  AsyncHandler(async function signUp(
    req: Request,
    res: Response
  ): Promise<any> {
    const payload = payloadValidation.validateSync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    const data = AuthService.register(payload)
    const buildResponse = BuildResponse.get(data)

    // cookie will expired in 1 hr
    const expires = new Date()
    expires.setHours(expires.getHours() + 1)

    return res
      .cookie('token', data.accessToken, {
        expires,
        path: '/v1',
      })
      .json(buildResponse)
  })
)

export default router
