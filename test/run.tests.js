const test = require('ava');
const mock = require('mock-require');
let sut = require('../helpers/run_container');

const containerName = 'foo';
const context = { name: 'local-test', root: '', options: [], containers: [{ name: 'foo', port: 3210 }]};

test('Should run docker command', t => {
  mock('shelljs', { 
    exec: (cmd) => {
      t.assert(cmd.indexOf('docker run') === 0);
    },
    echo: (cmd) => {
      // noop
    },
  });
  mock.reRequire('../helpers/run_container');
  sut = mock.reRequire('../operations/run');
  sut(context, containerName);

  mock.stop('shelljs');
});

test('Should bind to container port 3000 if shorthand mapping is provided', t => {
  mock('shelljs', { 
    exec: (cmd) => {
      t.assert(cmd.indexOf('3210:3000') > -1);
    },
    echo: (cmd) => {
      // noop
    },
  });
  mock.reRequire('../helpers/run_container');
  sut = mock.reRequire('../operations/run');
  
  sut(context, containerName);

  mock.stop('shelljs');
});
