import Express, { Application, Request, Response } from 'express'
import path from 'path'
import Cors from 'cors'
import Helmet from 'helmet'
import Compression from 'compression'
import http from 'http'

import swaggerUI from 'swagger-ui-express'

import allowedOrigins from './constants/ConstAllowedOrigins'
import { APP_NAME, APP_PORT } from './constants/ConstEnv'
import { optionsSwaggerUI, swaggerDoc } from './utils/Swagger'

// import routes here
import publicRoutes from './routes/public'
import v1Routes from './routes/v1'
import ErrorYupValidation from './middlewares/ErrorYupValidation'
import ErrorResponse from './middlewares/ErrorResponse'

const corsOption: Cors.CorsOptions = {
  origin: allowedOrigins,
}

class App {
  public readonly application: Application
  private readonly port: number | string
  private readonly staticPath: string = path.resolve(`${__dirname}/../public`)

  constructor(port?: number | string) {
    this.port = port ?? APP_PORT
    this.application = Express()

    // run middleware plugins
    this.runPlugins()

    // generate swagger documentations
    this.generateSwaggerDocs()

    // generate route paths
    this.generateRoutes()
  }

  private runPlugins(): void {
    this.application.use(Helmet())
    this.application.use(Cors(corsOption))
    this.application.use(Compression())
    this.application.use(Express.urlencoded({ extended: true }))
    this.application.use(
      Express.json({
        limit: '10mb',
        type: 'application/json',
      })
    )
    this.application.use(Express.static(this.staticPath))
  }

  private generateSwaggerDocs(): void {
    this.application.get('/v1/api-docs.json', (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(swaggerDoc)
    })

    this.application.use('/v1/api-docs', swaggerUI.serve)
    this.application.get(
      '/v1/api-docs',
      swaggerUI.setup(swaggerDoc, optionsSwaggerUI)
    )
  }

  private generateRoutes(): void {
    // public routes
    this.application.use(publicRoutes)
    this.application.use(v1Routes)

    // private routes

    // Catch error 404 when endpoint not found
    this.application.use('*', function (req: Request, res: Response) {
      return res.status(404).json({
        status: 404,
        message: `Sorry, HTTP resource you are looking for was not found.`,
      })
    })
  }

  public run(): void {
    // handle error
    this.application.use(ErrorYupValidation)
    this.application.use(ErrorResponse)

    // error handler
    this.application.use(function (err: any, req: Request, res: Response) {
      const errStatus = err.status ?? 500
      const errMessage = err.message ?? 'UNKNOWN ERROR'

      res.locals.message = errMessage
      res.locals.error = err

      console.error(
        `${errStatus} - ${errMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      )

      return res.status(errStatus).json({
        error: errMessage,
        status: errStatus,
      })
    })

    this.application.set('port', this.port)
    const server = http.createServer(this.application)

    const   onError = (error: { syscall: string; code: string }): void => {
      if (error.syscall !== 'listen') {
        throw new Error(`${error.code}: ${error.syscall}`)
      }

      const bind =
        typeof this.port === 'string'
          ? `Pipe ${this.port}`
          : `Port ${this.port}`

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`)
          process.exit(1)

        case 'EADDRINUSE':
          console.error(`${bind} is already in use`)
          process.exit(1)

        default:
          throw new Error(`${error.syscall}: ${error.code}`)
      }
    }

    const onListening = (): void => {
      const addr = server.address()
      const bind = typeof addr === 'string' ? `${addr}` : `${addr?.port}`

      const msgType = `${APP_NAME}`
      const message = `Server listening on http://localhost:${bind}`

      console.log(`[SERVER]: ${msgType} ${message}`)
    }

    server.listen(this.port)
    server.on('error', onError)
    server.on('listening', onListening)
  }
}

export default App
