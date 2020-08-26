const shell = require('shelljs');

module.exports = context => {
  const cmd = `docker network create --driver bridge ${context.name}`;
  shell.echo(cmd);
  shell.exec(cmd);
};
