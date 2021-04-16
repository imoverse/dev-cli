const shell = require('shelljs');

const getPortMapping = (port, debugport = false) => {
  const toPort = debugport ? 9229 : 3000;
  if (typeof port === 'number' || port.indexOf(':') === -1) {
    return `${port}:${toPort}`;
  }
  return port;
};

const getDebugParameter = port => port ? ` --inspect=0.0.0.0:${port}` : '';
const getDebugPort = port => {
  const add = 6000;
  if (typeof port === 'number') {
    return port + add;
  }
  const colonIndex = port.indexOf(':');
  if (colonIndex >= 0) {
    return parseInt(port.substr(0, colonIndex), 10) + add;
  }
  return port;
};
const runContainer = (context, containerConfig) => {
  const flags = ['-d'];
  let itr = 0;
  const {
    name,
    port,
    debugport = getDebugPort(port),
    cmd = `npm run dev`,
    volume,
  } = containerConfig;
  let containerPorts;

  if (containerConfig.port instanceof Array) {
    containerPorts = containerConfig.port.map(p => `-p ${getPortMapping(p)}`).join(' ');
  } else {
    containerPorts = `-p ${getPortMapping(port)}`;
  }

  const debugports = `-p ${getPortMapping(debugport, true)}`;

  context.options.forEach(flag => {
    if (flag.startsWith('-')) { flags[itr += 1] = flag; } else flags[1] = flag;
  });

  const env = !containerConfig.env ? '' : containerConfig.env.map(e => {
    const key = Object.keys(e)[0];
    const value = e[key];
    return `-e ${key}=${value}`;
  }).join(' ');

  const workingDir = `${context.root}/${name}`;

  const containerCmd = cmd === 'default' ? '' : cmd;
  let containerVolume = `-v ${workingDir}:/app`;
  if (volume === false) {
    containerVolume = '';
  }
  const run = `docker run -e NODE_ENV=local ${env} ${flags[0]} ${containerPorts} ${debugports} ${containerVolume} --network ${context.name} --name ${containerConfig.name} ${containerConfig.name} ${containerCmd}`;

  shell.echo(run);
  shell.exec(run);
};

module.exports = runContainer;
