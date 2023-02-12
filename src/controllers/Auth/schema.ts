import * as yup from 'yup'

export interface UserPayload {
  username: string
  password: string
}

const payloadValidation: yup.ObjectSchema<UserPayload> = yup
  .object({
    username: yup.string().required(),
    password: yup.string().min(6).required(),
  })
  .required()

export {
    payloadValidation
}
