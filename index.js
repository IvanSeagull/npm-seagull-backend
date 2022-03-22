#!/usr/bin/env node
import fs from 'fs';
import { exec } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

import jsonfile from 'jsonfile';

import {
  indexText,
  indexWithSwaggerText,
  mainRouterText,
  swaggerText,
  fullIndexText,
  configText,
  dbText,
  gitText,
} from './constants/index.js';
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

const addScripts = () => {
  try {
    let packaged = jsonfile.readFileSync('package.json');
    packaged.scripts.dev = 'nodemon index';
    console.log(packaged.scripts);
    jsonfile.writeFileSync('package.json', packaged, { spaces: 2 });
  } catch (error) {}
};

const setUpFolders = async (type = 1) => {
  // console.clear();

  console.log(chalk.blue('Setting up folders'));
  // create folders structure
  fs.mkdirSync(`${dir}/Routes`);
  fs.mkdirSync(`${dir}/Controllers`);
  // create index file

  // changing package
  try {
    let packaged = jsonfile.readFileSync(`${dir}/package.json`);
    packaged.scripts.dev = 'nodemon server';
    packaged.scripts.start = 'node server';
    packaged.main = 'server.js';
    jsonfile.writeFileSync(`${dir}/package.json`, packaged, { spaces: 2 });
  } catch (error) {
    console.error(error);
  }

  fs.appendFile(`${dir}/Routes/mainRouter.js`, mainRouterText, function (err) {
    if (err) throw err;
  });

  if (type === 1) {
    fs.appendFile(`${dir}/server.js`, indexText, function (err) {
      if (err) throw err;
    });
  } else if (type === 2) {
    try {
      let packaged = jsonfile.readFileSync(`${dir}/package.json`);
      packaged.scripts.createMigration =
        'npx sequelize-cli model:generate --name [name] --attributes email:string';
      packaged.scripts.migrate = 'npx sequelize-cli db:migrate';
      packaged.scripts.down = 'npx sequelize-cli db:migrate:undo';

      packaged.main = 'server.js';
      jsonfile.writeFileSync(`${dir}/package.json`, packaged, { spaces: 2 });
    } catch (error) {
      console.error(error);
    }
    fs.appendFile(`${dir}/server.js`, fullIndexText, function (err) {
      if (err) throw err;
    });
    fs.appendFile(`${dir}/config.js`, configText, function (err) {
      if (err) throw err;
    });
    fs.appendFile(`${dir}/db.js`, dbText, function (err) {
      if (err) throw err;
    });
    fs.appendFile(`${dir}/.gitignore`, gitText, function (err) {
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
    console.log('Custom');
  }
};

if (!fs.existsSync(dir) && process.argv[2] !== undefined) {
  console.clear();

  let type = await askType();
  main(type);
} else {
  console.log('Folder with that name already exists');
}
