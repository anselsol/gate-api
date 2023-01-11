import type { Express } from 'express';

import basicAuth from 'express-basic-auth'
import swaggerUi from 'swagger-ui-express';
import fs from "fs";
import YAML from "yaml";

const swaggerSpecs = YAML.parse(fs.readFileSync("./src/config/swagger.yaml", "utf8"));

export function swaggerAuth(app: Express) {
  app.use('/api-docs', basicAuth({
    users: {
      'darth': '6R_sG@3uamTkzWj3g9rp@HgAG2-N!Q-w',
    },
    challenge: true,
    realm: 'docs',
  }), swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
}