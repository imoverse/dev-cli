const fs = require('fs');
const shell = require('shelljs');
const findContainer = require('../helpers/find_container_in_list');

const runCommand = (containerName, path = '.') => {
  let dockerfile = '';
  if (path !== '.') {
    dockerfile = `-f ${path}/Dockerfile`;
  }
  const cmd = `docker build -t ${containerName} ${dockerfile} ${path}`;
  shell.echo(cmd)
  shell.exec(cmd);
};

module.exports = (context, search) => {
  if (search === 'all') {
    context.containers.forEach((c) => {
      const path = `${context.root}/${c.name}`;
      runCommand(c.name, path);
    });
    return;
  }

  if (search) {
    const container = findContainer(context, search);
    if (container) {
      const path = `${context.root}/${container.name}`;
      runCommand(container.name, path);
    } else {
      console.error(`Could not find container matching '${search}'`);
    }
    return;
  }

  fs.access('Dockerfile', fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Current directory is missing Dockerfile');
      return;
    }
    const cwd = process.cwd();
    if (cwd.lastIndexOf('\\') !== -1) {
      containerName = cwd.substring(cwd.lastIndexOf('\\') + 1);
    } else {
      containerName = cwd.substring(cwd.lastIndexOf('/') + 1);
    }
    runCommand(containerName);
  });
};
