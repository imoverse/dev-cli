const { findAndApply } = require('../helpers/find');

const shell = require('shelljs');

module.exports = (context, op = 'clone', search) => {

  findAndApply(context, search, (_, { name, path }) => {
    const cmd = op === 'clone' ? `git clone ${context.gitBasePath}/${name}.git ${path}` : `git -C ${path} pull --rebase`;
    shell.echo(cmd)
    shell.exec(cmd);
  });

};
