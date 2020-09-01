const shell = require('shelljs');
const chalk = require('chalk');
const { findAndApply } = require('../helpers/find');

module.exports = (context, search) => {
  if (context.operation === 'init') {
    shell.echo(chalk`
      {blue Installing dependencies ===============================}
      `);
  }

  const fn = (_, { path }) => {
    const cmd = `cd ${path} && npm i`;
    shell.echo(cmd);
    shell.exec(cmd);
  };
  findAndApply(context, search, fn, { onlyContainers: true });
  findAndApply(context, search, fn, { onlyPackages: true });
};
