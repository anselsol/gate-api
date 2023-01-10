import type { Express } from 'express';

import { checkWallet, login, openLogin } from './accounts';
import { createGame, updateGame } from './arkade/games';
import { swaggerAuth } from './swagger';

export function router(app: Express) {
  // Accounts
  app.post('/login', login);
  app.post('/open-login', openLogin);
  app.get('/check-wallet', checkWallet);

  // Arkade
  app.get('/arkade/games', createGame);
  app.put('/arkade/games/:id', updateGame);
  app.get('/arkade/leaderboards', login);

  // @ts-ignore
  app.use('/api-docs', swaggerAuth);
}