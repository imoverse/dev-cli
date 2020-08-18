const { findAndApply } = require('../helpers/find');

const shell = require('shelljs');

module.exports = (context, op = 'clone', search) => {

  findAndApply(context, search, (_, { name }) => {
    const target = `${context.root}/${name}`;
    const cmd = op === 'clone' ? `git clone ${context.gitBasePath}/${name}.git ${target}` : `git -C ${target} pull --rebase`;
    shell.echo(cmd)
    shell.exec(cmd);
  });

};
