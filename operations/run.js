const fs = require('fs');
const findContainer = require('../helpers/find_container_in_list');
const runContainer = require('../helpers/run_container');


module.exports = (context, search) => {
  if (search === 'all') {
    context.containers.forEach((c) => {
      const path = `${context.root}/${c.name}`;
      runContainer(context, c);
    });
    return;
  }

  if (search) {
    const container = findContainer(context, search);
    if (container) {
      runContainer(context, container);
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
    let containerName;
    if (cwd.lastIndexOf('\\') !== -1) {
      containerName = cwd.substring(cwd.lastIndexOf('\\') + 1);
    } else {
      containerName = cwd.substring(cwd.lastIndexOf('/') + 1);
    }
    const containerConfig = context.containers.find((c) => c.name === containerName);
    runContainer(context, containerConfig);
  });
};