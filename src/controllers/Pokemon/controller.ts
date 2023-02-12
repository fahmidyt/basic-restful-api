import express, { Request, Response, NextFunction } from 'express'
import Authorization from '../../middlewares/Authorization'
import BuildResponse from '../../modules/BuildResponse'
import AsyncHandler from '../../wrapper/AsyncHandler'
import PokemonService from './service'

const router = express.Router()

router.get(
  '/pokemon',
  Authorization,
  AsyncHandler(async function getAll(
    req: Request,
    res: Response
  ): Promise<any> {
    const data = await PokemonService.getAll(req)
    const buildResponse = BuildResponse.get(data)

    return res.status(200).json(buildResponse)
  })
)

export default router
