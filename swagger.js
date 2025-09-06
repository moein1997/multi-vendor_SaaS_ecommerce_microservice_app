import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: 'Multi-vendor SaaS Ecommerce Microservice API',
        description: 'This is a multi-vendor SaaS ecommerce microservice application. It provides various services such as user authentication, product management, order processing, and more. The application is built using Node.js, Express, and MongoDB, and follows a microservice architecture to ensure scalability and maintainability.',
    },
    host: 'localhost',
    version: '1.0.0',
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/auth.router.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc)