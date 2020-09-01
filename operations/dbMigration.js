const shell = require('shelljs');
const { findAndApply } = require('../helpers/find');
const startExternal = require('./startExternal');

module.exports = (context, search) => {
  startExternal(context, 'imove-pg');
  findAndApply(context, search, (_, { name, path }) => {
    const cmd = `docker run -v ${path}:/app --network ${context.name} -e NODE_ENV=local --rm --name ${name}-setupdb ${name} npm run db-migration`;

    shell.echo(cmd);
    shell.exec(cmd);
  }, { onlyContainers: true });
};
