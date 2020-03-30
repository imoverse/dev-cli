const shell = require('shelljs');

module.exports = (context, namespace) => {
  const ns = context.namespaces.find((ns) => ns.env === namespace);
  if (!ns) {
    console.error(`Could not find namespace ${namespace}. Available namespaces are [${context.namespaces.map((ns) => ns.env).join(', ')}].`);
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
