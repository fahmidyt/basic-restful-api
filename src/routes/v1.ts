import Express from 'express'

import PokemonController from '../controllers/Pokemon/controller'
import AuthController from '../controllers/Auth/controller'

const route = Express.Router()

route.use('/v1', PokemonController)
route.use('/v1', AuthController)


export default route