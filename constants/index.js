export const indexText = `//author: Ivan Seagull
const express = require('express');
const server = express();

server.use(express.json());

const mainRouter = require('./Routes/mainRouter');

server.use('/api', mainRouter);

server.get('/', (req, res) => {
  res.status(200).json({ msg: 'Home' });
});

const PORT = process.env.PORT || 5000

const startServer = async () => {
  server.listen(PORT, () => {
    console.log('Listening server on port ', PORT);
  });
};

startServer();
`;

export const mainRouterText = `//author: Ivan Seagull
const { Router } = require('express');

const mainRouter = new Router();

// example of additional Router
//const userRouter = require('./userRouter');


mainRouter.get('/', (req, res) => {
  res.status(200).json({ msg: 'api router' });
});

// 
//mainRouter.use('/users', userRouter);

module.exports = mainRouter;

`;

export const indexWithSwaggerText = `//author: Ivan Seagull
const express = require('express');
const server = express();

server.use(express.json());

// SWAGGER DOCS
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
// SWAGGER DOCS

const mainRouter = require('./Routes/mainRouter');

server.use('/api', mainRouter);

server.get('/', (req, res) => {
  res.status(200).json({ msg: 'Home' });
});

const PORT = process.env.PORT || 5000

const startServer = async () => {
  server.listen(PORT, () => {
    console.log('Listening server on port ', PORT);
  });
};

startServer();`;

export const fullIndexText = `//author: Ivan Seagull
const express = require('express');
const server = express();
const db = require('./db');

server.use(express.json());

// SWAGGER DOCS
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
// SWAGGER DOCS

const mainRouter = require('./Routes/mainRouter');

server.use('/api', mainRouter);

server.get('/', (req, res) => {
  res.status(200).json({ msg: 'Home' });
});

const PORT = process.env.PORT || 5000

const startServer = async () => {
  db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch((err) => console.log('Error ', err));

  server.listen(PORT, () => {
    console.log('Listening server on port ', PORT);
  });
};

startServer();`;

export const swaggerText = `{
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0", 
    "title": "Project title",
    "description": "project desc",
    "license": {
      "name": "MIT",
      "url": "https://opensource.org/licenses/MIT"
    }
  },
  "host": "localhost:5000",
  "basePath": "/",
  "servers": [
      {
        "url": "http://localhost:5000"
      }
    ],
  "apis": ["./Routes/*.js", "./index.js"],

  "tags": [
    {
      "name": "Users",
      "description": "user-controller"
    }
  ]
}`;

export const dbText = `const Sequelize = require('sequelize');
const configData = require('./config');

const db = new Sequelize(configData.DB_NAME, configData.DB_USER, configData.DB_PASSWORD, {
  host: configData.DB_HOST,
  dialect: 'postgres',
  //   operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = db;
`;

export const configText = `
const configData = {
  DB_NAME: 'name',
  DB_USER: 'user',
  DB_PASSWORD: 'password',
  DB_HOST: 'localhost',
  SECRET_JWT: 'very_secret_string_to_create_password',

  // for admin panel
  //COOKIE_NAME: 'cookie_name',
  //COOKIE_PASSWORD: 'cookie_password',
  // ADMINS: [
  //   {
  //     email: 'test@gmail.com',
  //     password: 'password',
  //   },
  //   {
  //     email: 'test@gmail.com',
  //     password: 'password',
  //   },
  // ],
};

module.exports = configData;
`;

export const gitText = `# node modules
/node_modules
# config for db
/config
config.js`;
