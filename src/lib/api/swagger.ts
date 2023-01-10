import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    info: {
      title: 'MAGNUM AI API',
      version: '2.0.0',
      description: 'Example docs',
    },
  },
  apis: ['swagger.yaml'],
};

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;