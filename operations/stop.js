const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');
const { findAndApply } = require('../helpers/find');

module.exports = (context, search) => {
  findAndApply(context, search, (_, { path, name }) => {
    fs.access(`${path}/Dockerfile`, fs.constants.F_OK, err => {
      if (err) {
        shell.echo(chalk`{red ERROR:} ${!search ? 'Current directory' : path} is missing Dockerfile`);
        return false;
      }
      const cmd = `docker rm -f ${name}`;
      shell.echo(cmd);
      shell.exec(cmd);
      return true;
    });
  }, { onlyContainers: true });
};
