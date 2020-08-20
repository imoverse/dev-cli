const { findAndApply } = require('../helpers/find');
const shell = require('shelljs');

module.exports = (context, search) => {
  findAndApply(context, search, (_, { name, path }) => {
    let flags = ['-d'];
    let itr = 0;

    const cmd = `docker run -v ${path}:/app --network ${context.name} -e NODE_ENV=local --rm --name ${name}-setupdb ${name} npm run db-migration`;
  
    shell.echo(cmd);
    shell.exec(cmd);
  }, { onlyContainers: true });
};
