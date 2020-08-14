const findContainer = require('../helpers/find_container_in_list');
const shell = require('shelljs');

module.exports = (context, search) => {

  const pullContainer = (name) => {
    const target = `${context.root}/${name}`;
    const cmd = `git clone ${context.gitBasePath}/${name}.git ${target}`;
    shell.echo(cmd);
    shell.exec(cmd);
  };

  if (search) {
    const container = findContainer(context, search);
    if (container) {
      pullContainer(container.name);
    } else {
      console.error(`Could not find container matching '${search}'`);
    }
    return;
  }

  context.containers.forEach(({ name }) => {
    pullContainer(name);
  });
}