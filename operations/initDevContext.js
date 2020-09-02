const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');

module.exports = (name = 'imove', envFolder = process.env.IMOVE_ENV_FOLDER ? process.env.IMOVE_ENV_FOLDER : `${process.env.HOME}/Dropbox/imove-dev`) => {
  try {
    fs.accessSync('./.dev', fs.constants.R_OK);
    shell.echo(chalk`{red .dev already exist in this folder }`);
    process.exit(1);
  } catch (err) {
    shell.echo(chalk`Trying to copy env files from {blue ${envFolder}}.`);
  }
  try {
    fs.accessSync(`${envFolder}/${name}.dev`, fs.constants.R_OK);
  } catch (err) {
    shell.echo(chalk`{red Could not find context file ${envFolder}/${name}.dev }
    The folder can be specified using environment variable IMOVE_ENV_FOLDER.`);
  }

  const cmd = `ln -s ${envFolder}/${name}.dev ./.dev`;
  shell.echo(cmd);
  shell.exec(cmd);
};
