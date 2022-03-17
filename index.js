#!/usr/bin/env node
import fs from 'fs';
import { exec } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

import { indexText, mainRouterText } from './constants/index.js';
console.log(chalk.blue('Hello world!'));

let dir = `./${process.argv[2]}`;

async function askType() {
  const type = await inquirer.prompt({
    name: 'selectType',
    type: 'list',
    message: 'Select type of the project',
    choices: [
      'Bare project - basically only index.js',
      'Sample routes - with mainRouter',
      'Sequelize sample - with sequelize and postgresql project',
    ],
  });

  return type.selectType;
}

const setUpFolders = async () => {
  console.clear();
  console.log(chalk.blue('Setting up folders'));
  // create folders structure
  fs.mkdirSync(`${dir}/Routes`);
  fs.mkdirSync(`${dir}/Controllers`);
  // create index file
  fs.appendFile(`${dir}/index.js`, indexText, function (err) {
    if (err) throw err;
  });

  fs.appendFile(`${dir}/Routes/mainRouter.js`, mainRouterText, function (err) {
    if (err) throw err;
  });

  finishedMessage();
};

const finishedMessage = () => {
  console.clear();
  console.log(
    chalk.blue(`Installation finished
  
  cd ${dir} | code .
  `),
  );
};

const main = async () => {
  fs.mkdirSync(dir);
  console.clear();
  // init npm, install modules, git init
  const spinner = createSpinner('Initializing repository with npm').start();
  exec(
    `clear && cd ${process.argv[2]} && npm init -y  && npm i express nodemon bcryptjs express-validator jsonwebtoken`,
    (error, stdout, stderr) => {
      if (error) {
        spinner.error({ text: `Error` });
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
      // console.log(`stdout: ${stdout}`);
      spinner.success({ text: 'Finished' });
      setUpFolders();
    },
  );
};

if (!fs.existsSync(dir) && process.argv[2] !== undefined) {
  let type = await askType();
  console.log(chalk.blue(type));
  main();
} else {
  console.log('Folder with that name already exists');
}
