const shell = require('shelljs');
const chalk = require('chalk');

module.exports = context => {
  if (context.operation === 'init') {
    shell.echo(chalk`
      {blue Cloning Creating docker network =======================}
      `);
  }

  console.log('Running create network');
  const cmd = `docker network create --driver bridge ${context.name}`;
  shell.echo(cmd);
  shell.exec(cmd);
};
