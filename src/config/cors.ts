import type { Express } from "express";

import cors from 'cors'

export function corsSetup(app: Express) {
  // Apply origin whitelist from env config
  if (process.env.ORIGIN_WHITELIST) {
    const allowedOrigins = process.env.ORIGIN_WHITELIST.split(',')

    // CORS config
    const corsOptions: cors.CorsOptions = {
      origin: allowedOrigins
    }
    app.use(cors(corsOptions))

    // Origin header validation
    app.all('*', (req, res, next) => {
      const origin = req.get('origin') || ''
      if (allowedOrigins.indexOf(origin) < 0) {
        return res.sendStatus(401)
      }
      return next()
    })
  } else {
    app.use(cors())
  }
}