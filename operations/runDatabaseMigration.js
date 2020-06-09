const findContainer = require('../helpers/find_container_in_list');
const shell = require('shelljs');

module.exports = (context, search) => {

  const runDbMigration = (name) => {
    const target = `${context.root}/${name}`;
    const cmd = `cd ${target} && dev setupDb`;
    shell.echo(cmd)
    shell.exec(cmd);
  };

  if (search) {
    const container = findContainer(context, search);
    if (container) {
      runDbMigration(container.name);
    } else {
      console.error(`Could not find container matching '${search}'`);
    }
    return;
  }

  context.containers.forEach(({ name }) => {
    runDbMigration(name);
  });
}
