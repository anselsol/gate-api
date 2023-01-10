import express from 'express'
import { corsSetup } from '@config';
import { router } from '@api_web/router';

const app = express();

// Activate body data parsing
app.use(express.json());

corsSetup(app);

router(app);

// Start api server
const httpPort = parseInt(process.env.PORT || '5010')

app.listen(httpPort, () => {
  console.log(`listening on *:${httpPort}`);
});

process.on('unhandledRejection', (err: any, p: any) => {
  console.error(`Unhandled rejection: ${err} promise: ${p})`)
});