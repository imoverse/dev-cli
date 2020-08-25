const { findAndApply } = require('../helpers/find');
const shell = require('shelljs');

module.exports = (context, search) => {
  const fn = (_, {path}) => {
    const cmd = `cd ${path} && npm i`;
    shell.echo(cmd)
    shell.exec(cmd);
  };
  findAndApply(context, search, fn, { onlyContainers: true });
  findAndApply(context, search, fn, { onlyPackages: true });
};
