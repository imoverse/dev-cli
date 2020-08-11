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


test('Should override cmd if provided', t => {
  mock('shelljs', { 
    exec: (cmd) => {
      t.assert(cmd.indexOf('custom command') > -1);
    },
    echo: (cmd) => {
      // noop
    },
  });
  mock.reRequire('../helpers/run_container');
  sut = mock.reRequire('../operations/run');
  const ctx = { name: 'local-test', root: '', options: [], containers: [{ name: 'foo', port: 3210, cmd: 'custom command' }]};
  
  sut(ctx, containerName);

  mock.stop('shelljs');
});

test('Should map env to -e flags', t => {
  mock('shelljs', { 
    exec: (cmd) => {
      console.log(cmd);
      t.assert(cmd.indexOf('-e foo=1 -e bar=2') > -1);
    },
    echo: (cmd) => {
      // noop
    },
  });
  mock.reRequire('../helpers/run_container');
  sut = mock.reRequire('../operations/run');
  const ctx = { name: 'local-test', root: '', options: [], containers: [{ name: 'foo', port: 3210, env: [{ foo: 1 }, { bar: 2}] }]};
  
  sut(ctx, containerName);

  mock.stop('shelljs');
});
