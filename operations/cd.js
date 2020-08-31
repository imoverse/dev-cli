const shell = require('shelljs');
const { findAndApply } = require('../helpers/find');

module.exports = (context, search) => {
  const match = findAndApply(context, search, (_, { path }) => path);
  shell.echo(match || context.root);
};
