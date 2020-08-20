const fs = require('fs');
const { findAndApply } = require('../helpers/find');
const runContainer = require('../helpers/run_container');
const chalk = require('chalk');

module.exports = (context, search) => {
  findAndApply(context, search, (_, repo) => {
    fs.access(`${repo.path}/Dockerfile`, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(chalk`{red ERROR:} ${!search ? 'Current directory' : repo.path} is missing Dockerfile`);
        return;
      }
      runContainer(context, repo);
    });
  }, { onlyContainers: true });
};
