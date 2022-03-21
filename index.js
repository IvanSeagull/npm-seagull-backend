#!/usr/bin/env node
import fs from 'fs';
import { exec } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

import { indexText, mainRouterText, indexWithSwaggerText, swaggerText } from './constants/index.js';
console.log(chalk.blue('Hello world!'));

let dir = `./${process.argv[2]}`;

async function askType() {
  const type = await inquirer.prompt({
    name: 'selectType',
    type: 'list',
    message: 'Select type of the project',
    choices: [
      '1) Bare project - basically only server.js',
      '2) Full setup - sequelize, pg, swagger',
      '3) Custom setup',
    ],
  });

  return type.selectType;
}

const setUpFolders = async (type = 1) => {
  // console.clear();

  console.log(chalk.blue('Setting up folders'));
  // create folders structure
  fs.mkdirSync(`${dir}/Routes`);
  fs.mkdirSync(`${dir}/Controllers`);
  // create index file

  fs.appendFile(`${dir}/Routes/mainRouter.js`, mainRouterText, function (err) {
    if (err) throw err;
  });

  if (type === 1) {
    fs.appendFile(`${dir}/index.js`, indexText, function (err) {
      if (err) throw err;
    });
  } else if (type === 2) {
    fs.appendFile(`${dir}/index.js`, indexWithSwaggerText, function (err) {
      if (err) throw err;
    });
    fs.appendFile(`${dir}/swagger.json`, swaggerText, function (err) {
      if (err) throw err;
    });
  }

  finishedMessage();
};

const finishedMessage = () => {
  // console.clear();
  console.log(
    chalk.blue(`Installation finished
  
  cd ${dir} | code .
  `),
  );
};

const main = async (type) => {
  // console.log(type[0]);
  fs.mkdirSync(dir);
  const spinner = createSpinner('Initializing repository').start();
  if (type[0] == 1) {
    exec(
      `cd ${process.argv[2]} && npm init -y && npm i express nodemon `,
      (error, stdout, stderr) => {
        if (error) {
          spinner.error({ text: `Error ${error}` });
          fs.unlinkSync(`${dir}/package.json`);
          fs.rmdirSync(dir);
          process.exit(1);
        }
        if (stderr) {
          spinner.error({ text: `Error` });
          fs.unlinkSync(`${dir}/package.json`);
          fs.rmdirSync(dir);
          process.exit(1);
        }
        spinner.success({ text: 'Finished' });
        setUpFolders();
      },
    );
  } else if (type[0] == 2) {
    // console.log(3);

    exec(
      `cd ${process.argv[2]} && npm init -y  && npm i express nodemon bcryptjs express-validator jsonwebtoken swagger-ui-express && npm install --save sequelize pg pg-hstore && npm install --save-dev sequelize-cli && npx sequelize-cli init `,
      // `cd ${process.argv[2]} && npm init -y`,

      (error, stdout, stderr) => {
        if (error) {
          spinner.error({ text: `Error ${error}` });
          // fs.unlinkSync(`${dir}/package.json`);
          // fs.unlinkSync(`${dir}/package-lock.json`);
          // fs.rmdirSync(`${dir}/node_modules`);
          // fs.rmdirSync(dir);
          process.exit(1);
        }
        if (stderr) {
          spinner.error({ text: `StdError ${error}` });
          // fs.unlinkSync(`${dir}/package.json`);
          // fs.unlinkSync(`${dir}/package-lock.json`);
          // fs.rmdirSync(`${dir}/node_modules`);
          // fs.rmdirSync(dir);
          process.exit(1);
        }
        spinner.success({ text: 'Finished' });
        setUpFolders(2);
      },
    );
  } else if (type[0] == 3) {
    // console.log(4);

    console.log('Custom');
  }
};

if (!fs.existsSync(dir) && process.argv[2] !== undefined) {
  console.clear();
  let type = await askType();
  // console.log(chalk.blue(type));
  main(type);
} else {
  console.log('Folder with that name already exists');
}
