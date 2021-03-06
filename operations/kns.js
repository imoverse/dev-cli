const shell = require('shelljs');

module.exports = (context, environment) => {
  const ns = context.environments.find(kns => kns.env === environment);
  if (!ns) {
    shell.echo(`Could not find environment ${environment}. Available environments are [${context.environments.map(kns => kns.env).join(', ')}].`);
    return;
  }

  const cmd1 = `kubectl config use-context ${ns.ctx}`;
  const cmd2 = `kubectl config set-context ${ns.ctx} --namespace=${ns.ns}`;
  const cmd3 = 'kubectl get pods';
  shell.echo(cmd1);
  shell.exec(cmd1);
  shell.echo(cmd2);
  shell.exec(cmd2);
  shell.echo(cmd3);
  shell.exec(cmd3);
};
