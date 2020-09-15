const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');

module.exports = (context, envFolder = process.env.IMOVE_ENV_FOLDER ? process.env.IMOVE_ENV_FOLDER : `${process.env.HOME}/Dropbox/imove-dev`) => {
  if (context.operation === 'init') {
    shell.echo(chalk`
      {blue Adding env files ======================================}
      `);
  }

  try {
    fs.accessSync(envFolder, fs.constants.R_OK);
  } catch (err) {
    shell.echo(chalk`{red Could not find env files folder at ${envFolder}. Please provide a valid path to the env file folder. }`);
    process.exit(1);
  }

  const containers = context.containers.map(c => c.name);
  containers.forEach(c => {
    const cmd = `cp ${envFolder}/env/${c}.env ${context.root}/${c}/.env`;
    shell.echo(cmd);
    shell.exec(cmd);
  });
};
