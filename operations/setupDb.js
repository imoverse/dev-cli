const shell = require('shelljs');

const runContainer = (context) => {
  const containerConfig = context.containers.find((c) => c.name === context.currentContainer);
  let flags = ['-d'];
  let itr = 0;
  context.options.forEach(flag => {
    if (flag.startsWith("-")) { flags[itr++] = flag }
    else flags[1] = flag;
  });
  const workingDir = `${context.root}/${containerConfig.name}`;
  let port = containerConfig.port;
  if (typeof containerConfig.port == 'number' || port.indexOf(':') === -1) {
    port = `${port}:3000`;
  }
  const cmd = `docker run -v ${workingDir}:/app --network ${context.name} -e NODE_ENV=local --rm --name ${containerConfig.name}-setupdb ${containerConfig.name} npm run db-migration`;

  shell.echo(cmd);
  shell.exec(cmd);
};

module.exports = runContainer;
