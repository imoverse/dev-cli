const shell = require('shelljs');
const { findAndApply } = require('../helpers/find');

module.exports = (context, op = 'clone', search) => {
  findAndApply(context, search, (_, { name, path }) => {
    const cmd = op === 'clone' ? `git clone ${context.gitBasePath}/${name}.git ${path}` : `git -C ${path} pull --rebase`;
    shell.echo(cmd);
    shell.exec(cmd);
  });
};
