import jwt from 'jsonwebtoken'
import {
  JWT_SECRET_ACCESS_TOKEN,
  JWT_SECRET_REFRESH_TOKEN,
} from '../../constants/ConstEnv'
import ResponseError from '../../modules/ResponseError'
import { UserPayload } from './schema'

class AuthService {
  private UserRegistered: UserPayload[] = []

  public login(payload: UserPayload) {
    const findUser = this.isExist(payload)

    if (!findUser)
      throw new ResponseError.NotFound('username or password incorrect!')

    const tokens = this.signToken(findUser)

    return {
      ...tokens,
      message: 'Successfully login!',
      payload: findUser,
      tokenType: 'Bearer',
    }
  }

  public register(payload: UserPayload) {
    const checkWithoutPassword = true
    const findUser = this.isExist(payload, checkWithoutPassword)

    if (findUser)
      throw new ResponseError.BadRequest(
        'User already registered. You should login instead'
      )

    this.UserRegistered.push(payload)

    const tokens = this.signToken(payload)

    return {
      ...tokens,
      message: 'Successfully registered.',
    }
  }

  private isExist(payload: UserPayload, checkWithoutPassword: boolean = false) {
    const findUser = this.UserRegistered.find((user) => {
      if (checkWithoutPassword) return user.username === payload.username

      return (
        user.username === payload.username && user.password === payload.password
      )
    })

    return findUser
  }

  private signToken(payload: UserPayload) {
    const accessToken = jwt.sign(payload, JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: '1h',
    })

    const refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH_TOKEN, {
      expiresIn: '7d',
    })

    return { accessToken, refreshToken }
  }
}

export default AuthService
