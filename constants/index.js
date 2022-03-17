const indexText = `//author: Ivan Seagull
const express = require('express');
const app = express();

app.use(express.json());

const mainRouter = require('./Routes/mainRouter');

app.use('/api', mainRouter);

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Home' });
});
const startApp = async () => {
  db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch((err) => console.log('Error ', err));

  app.listen(5000, () => {
    console.log('Listening server on port 5000');
  });
};

startApp();
`;

const mainRouterText = `//author: Ivan Seagull
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

module.exports = { indexText, mainRouterText };
