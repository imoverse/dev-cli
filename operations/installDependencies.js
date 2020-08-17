const { container: findContainer } = require('../helpers/find');
const shell = require('shelljs');

module.exports = (context, search) => {

  const installDependencies = (name) => {
    const target = `${context.root}/${name}`;
    const cmd = `cd ${target} && npm i`;
    shell.echo(cmd)
    shell.exec(cmd);
  };

  if (search) {
    const container = findContainer(context, search);
    if (container) {
      installDependencies(container.name);
    } else {
      console.error(`Could not find container matching '${search}'`);
    }
    return;
  }

  context.containers.forEach(({ name }) => {
    installDependencies(name);
  });
}
