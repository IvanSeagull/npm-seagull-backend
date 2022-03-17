#!/usr/bin/env node
let fs = require('fs');
var dir = `./${process.argv[2]}`;
const { exec } = require('child_process');

const { indexText, mainRouterText } = require('./constants');

const main = () => {
  // create folders structure
  fs.mkdirSync(dir);
  fs.mkdirSync(`${dir}/Routes`);
  fs.mkdirSync(`${dir}/Controllers`);
  // create index file
  fs.appendFile(`${dir}/index.js`, indexText, function (err) {
    if (err) throw err;
  });

  fs.appendFile(`${dir}/Routes/mainRouter.js`, mainRouterText, function (err) {
    if (err) throw err;
  });

  // init npm, install modules
  exec(
    `cd ${process.argv[2]} && npm init -y && git init && npm i express nodemon bcryptjs express-validator jsonwebtoken`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    },
  );
};

if (!fs.existsSync(dir) && process.argv[2] !== undefined) {
  main();
} else {
  console.log('Folder with that name already exists');
}
