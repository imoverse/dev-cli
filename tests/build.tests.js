const test = require('ava');
const mock = require('mock-require');
let sut = require('../operations/build');

const context = {
  name: 'local-test', root: '', options: [], vars: { npmToken: 'a' }, containers: [{ name: 'foo', port: '3210:3000' }],
};

const getContextTemplate = () => ({ ...context });

test('Should run docker build command', t => {
  mock('shelljs', {
    exec: cmd => {
      t.is(cmd, 'docker build --build-arg NPM_TOKEN=a -t foo -f /foo/Dockerfile /foo');
    },
    echo: () => {
      // noop
    },
  });

  mock('fs', {
    accessSync: () => true,
    constants: { F_OK: 1 },
  });
  sut = mock.reRequire('../operations/build');
  sut(getContextTemplate(), 'foo');

  mock.stop('shelljs');
  mock.stop('fs');
});

test('Should build all containers if param is "all"', t => {
  const called = [];
  mock('shelljs', {
    exec: cmd => {
      called.push(cmd);
    },
    echo: () => {
      // noop
    },
  });

  mock('fs', {
    accessSync: () => true,
    constants: { F_OK: 1 },
  });
  sut = mock.reRequire('../operations/build');
  const ctx = getContextTemplate();
  ctx.containers.push({ name: 'bar', vars: {} });
  sut(getContextTemplate(), 'all');

  t.is(called.length, 2);
  t.assert(called[0].indexOf('foo') > -1);
  t.assert(called[1].indexOf('bar') > -1);

  mock.stop('shelljs');
  mock.stop('fs');
});
