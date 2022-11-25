import { Connection, ConnectionConfig } from '@solana/web3.js'
import cors from 'cors'
import express from 'express'
// import swaggerUi from 'swagger-ui-express';

import { solanaAuthorize, verifyToken } from './solana-verify';

const globalSolCon = new Connection("https://mango.rpcpool.com/519be36fd046ccc2029dd0d471a9", "processed");

const app = express()

app.use(express.json());

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

app.get('/check-wallet', async (req, res) => {
  try {
    let tokenIsValid = await verifyToken(req.header('Authorization'));

    if (!tokenIsValid) {
      return res.status(401).send({ "error": 401 });
    }

    res.send({ "isLoggedIn": true });
  } catch (e) {
    res.status(401).send({ "error": 401 });
  }
});

app.post('/login', async (req, res) => {
  const { signedMessage, walletAddress } = req.body;

  try {
    let solanaLoginRes = await solanaAuthorize(signedMessage, walletAddress, globalSolCon);

    if (!solanaLoginRes) {
      return res.status(404).send({ "error": 404 });
    }

    res.send({
      "token": solanaLoginRes
    });
  } catch (e) {
    res.status(500).send({
      "error": "Cannot verify wallet"
    });
  }
});


// @ts-ignore
// app.use('/api-docs', basicAuth({
//   users: {
//     'solape': '6R_KG3uamTkzWjMg9rp@HgAZ2UN!Q-w',
//     'tv': 'ciuvRsgas*2@39mmxwEtXw.@9KY48c',
//     'coingecko': '.@9KY48ciuvRsgwEtXwyBas*2@39mmx'
//   },
//   challenge: true,
//   realm: 'docs',
// }), swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start api server
const httpPort = parseInt(process.env.PORT || '5010')

app.listen(httpPort, () => {
  console.log(`listening on *:${httpPort}`);
});

process.on('unhandledRejection', (err: any, p: any) => {
  console.error(`Unhandled rejection: ${err} promise: ${p})`)
})