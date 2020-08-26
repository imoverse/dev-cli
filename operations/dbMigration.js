const shell = require('shelljs');
const { findAndApply } = require('../helpers/find');

module.exports = (context, search) => {
  findAndApply(context, search, (_, { name, path }) => {
    const flags = ['-d'];
    const itr = 0;

    const cmd = `docker run -v ${path}:/app --network ${context.name} -e NODE_ENV=local --rm --name ${name}-setupdb ${name} npm run db-migration`;

    shell.echo(cmd);
    shell.exec(cmd);
  }, { onlyContainers: true });
};
