const shell = require('shelljs');

module.exports = (context, environment) => {
  const ns = context.environments.find((ns) => ns.env === environment);
  if (!ns) {
    console.error(`Could not find environment ${environment}. Available environments are [${context.environments.map((ns) => ns.env).join(', ')}].`);
    return;
  }
  
  const cmd1 = `kubectx ${ns.ctx}`;
  const cmd2 = `kubens ${ns.ns}`;
  const cmd3 = `kubectl get pods`;
  shell.echo(cmd1)
  shell.exec(cmd1);
  shell.echo(cmd2)
  shell.exec(cmd2);
  shell.echo(cmd3)
  shell.exec(cmd3);
};
