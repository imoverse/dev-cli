const { findAndApply } = require('../helpers/find');
const shell = require('shelljs');

module.exports = (context, search) => {
  findAndApply(context, search, (_, {path}) => {
    const cmd = `cd ${path} && npm i`;
    shell.echo(cmd)
    shell.exec(cmd);
  });
};
