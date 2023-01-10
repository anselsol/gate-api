import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Liberty Square API',
      version: '1.0.0',
      description: 'Contains the doc to all the endpoints of our API.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'JSONPlaceholder',
        url: 'https://jsonplaceholder.typicode.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5010',
        description: 'Development server',
      },
      {
        url: 'https://api.libertysquare.io',
        description: 'Production server',
      },
    ],
  },
  apis: ['swagger.yaml'],
};

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;