const shell = require('shelljs');

module.exports = (context) => {
  const cmd1 = `kubectl get pods ${context.options.join(' ')}`;
  shell.echo(cmd1);
  shell.exec(cmd1);
};
