const shell = require('shelljs');

const runContainer = (context, containerConfig) => {
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
  const cmd = `docker run ${flags[0]} -p ${port} -v ${workingDir}:/app --network ${context.name} --name ${containerConfig.name} ${containerConfig.name} npm run dev`;

  shell.echo(cmd);
  shell.exec(cmd);
};

module.exports = runContainer;
