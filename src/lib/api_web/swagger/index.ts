import basicAuth from 'express-basic-auth'
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from '@api/swagger';

export function swaggerAuth() {
  return basicAuth({
    users: {
      'darth': '6R_sG@3uamTkzWj3g9rp@HgAG2-N!Q-w',
    },
    challenge: true,
    realm: 'docs',
  }), swaggerUi.serve, swaggerUi.setup(swaggerSpecs)
}