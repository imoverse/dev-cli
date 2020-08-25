const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');

module.exports = (context, envFolder = process.env.IMOVE_ENV_FOLDER ? process.env.IMOVE_ENV_FOLDER : `${process.env.HOME}/Dropbox/imove-dev/env`) => {
  const containers = context.containers.map(c => c.name);

  fs.access(envFolder, fs.constants.R_OK, (err) => {
    if (err) {
      console.log(chalk`{red Could not find env files folder at ${envFolder}. Please provide a valid path to the env file folder. }`);
      return process.exit(1);
    }
    containers.forEach((c) => {
      cmd = `cp ${envFolder}/env/${c}.env ${context.root}/${c}/.env`;
      shell.exec(cmd);
    });
  });
};
