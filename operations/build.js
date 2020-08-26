const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');
const { findAndApply } = require('../helpers/find');

module.exports = (context, search) => {
  findAndApply(context, search, (_, repo) => {
    const path = !search ? '.' : `${context.root}/${repo.name}`;

    fs.access(`${repo.path}/Dockerfile`, fs.constants.F_OK, err => {
      if (err) {
        console.error(chalk`{red ERROR:} ${!search ? 'Current directory' : repo.path} is missing Dockerfile`);
        return false;
      }
      let dockerfile = '';
      if (path !== '.') {
        dockerfile = `-f ${path}/Dockerfile`;
      }
      const cmd = `docker build -t ${repo.name} ${dockerfile} ${path}`;
      shell.echo(cmd);
      shell.exec(cmd);
    });
  }, { onlyContainers: true });
};
