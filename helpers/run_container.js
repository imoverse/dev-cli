const shell = require('shelljs');

const runContainer = (context, containerConfig) => {
  let flags = ['-d'];
  let itr = 0;
  const {
    name,
    port,
    cmd = 'npm run dev',
    volume,
  } = containerConfig;
  let containerPorts;
  if (containerConfig.port instanceof Array) {
    containerPorts = containerConfig.port.map((p) => `-p ${p}`).join(' ');
  } else {
    containerPorts = `-p ${port}`;
  }

  context.options.forEach(flag => {
    if (flag.startsWith("-")) { flags[itr++] = flag }
    else flags[1] = flag;
  });
  const workingDir = `${context.root}/${name}`;
  let cmdPort = port;
  if (typeof port === 'number' || port.indexOf(':') === -1) {
    cmdPort = `${port}:3000`;
  }
  let containerCmd = cmd === 'default' ? '' : cmd;
  let containerVolume = `-v ${workingDir}:/app`;
  if (volume === false) {
    containerVolume = '';
  }
  const run = `docker run ${flags[0]} ${containerPorts} ${containerVolume} --network ${context.name} --name ${containerConfig.name} ${containerConfig.name} ${containerCmd}`;

  shell.echo(run);
  shell.exec(run);
};

module.exports = runContainer;
