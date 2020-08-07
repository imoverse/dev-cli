const shell = require('shelljs');

const getPortMapping = (port) => {
  if (typeof port === 'number' || port.indexOf(':') === -1) {
    return `${port}:3000`;
  }
  return port;
};

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
    containerPorts = containerConfig.port.map((p) => `-p ${getPortMapping(p)}`).join(' ');
  } else {
    containerPorts = `-p ${getPortMapping(port)}`;
  }

  context.options.forEach(flag => {
    if (flag.startsWith("-")) { flags[itr++] = flag }
    else flags[1] = flag;
  });

  const env = !containerConfig.env ? '' : containerConfig.env.map(e => {
    const key = Object.keys(e)[0];
    const value = e[key];
    return `-e ${key}=${value}`;
  }).join(' ');

  const workingDir = `${context.root}/${name}`;

  let containerCmd = cmd === 'default' ? '' : cmd;
  let containerVolume = `-v ${workingDir}:/app`;
  if (volume === false) {
    containerVolume = '';
  }
  const run = `docker run ${env} ${flags[0]} ${containerPorts} ${containerVolume} --network ${context.name} --name ${containerConfig.name} ${containerConfig.name} ${containerCmd}`;

  shell.echo(run);
  shell.exec(run);
};

module.exports = runContainer;
