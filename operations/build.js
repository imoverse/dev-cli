const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');
const { findAndApply } = require('../helpers/find');

module.exports = (context, search) => {
  if (context.operation === 'init') {
    shell.echo(chalk`
      {blue Running build =========================================}
      `);
  }
  findAndApply(context, search, (_, repo) => {
    const path = !search ? '.' : `${context.root}/${repo.name}`;
    try {
      fs.accessSync(`${repo.path}/Dockerfile`, fs.constants.F_OK);
    } catch (err) {
      shell.echo(chalk`{red ERROR:} ${!search ? 'Current directory' : repo.path} is missing Dockerfile`);
      return false;
    }
    let dockerfile = '';
    if (path !== '.') {
      dockerfile = `-f ${path}/Dockerfile`;
    }
    const cmd = `docker build --build-arg NPM_TOKEN=${context.vars.npmToken} -t ${repo.name} ${dockerfile} ${path}`;
    shell.echo(cmd);
    shell.exec(cmd);
    return true;
  }, { onlyContainers: true });
};
