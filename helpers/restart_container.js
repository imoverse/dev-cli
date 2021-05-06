const shell = require('shelljs');

const restartContainer = (context, containerConfig) => {
  const run = `docker restart ${containerConfig.name}`;

  shell.echo(run);
  shell.exec(run);
};

module.exports = restartContainer;
