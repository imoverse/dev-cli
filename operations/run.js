const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');
const { findAndApply } = require('../helpers/find');
const runContainer = require('../helpers/run_container');

module.exports = (context, search) => {
  findAndApply(context, search, (_, repo) => {
    fs.access(`${repo.path}/Dockerfile`, fs.constants.F_OK, err => {
      if (err) {
        shell.echo(chalk`{red ERROR:} ${!search ? 'Current directory' : repo.path} is missing Dockerfile`);
        return;
      }
      runContainer(context, repo);
    });
  }, { onlyContainers: true });
};
