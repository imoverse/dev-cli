const shell = require('shelljs');
const chalk = require('chalk');

module.exports = context => {
  if (context.operation === 'init') {
    shell.echo(chalk`
      {blue Cloning Creating docker network =======================}
      `);
  }

  const cmd = `docker network create --driver bridge ${context.name}`;
  shell.echo(cmd);
  shell.exec(cmd);
};
