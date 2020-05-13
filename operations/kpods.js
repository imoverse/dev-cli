const shell = require('shelljs');

module.exports = () => {
  const cmd1 = `kubectl get pods`;
  shell.echo(cmd1)
  shell.exec(cmd1);
};
