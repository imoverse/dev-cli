const test = require('ava');
const mock = require('mock-require');
let sut = require('../helpers/run_container');

const containerName = 'foo';
const context = {
  name: 'local-test', root: '', options: [], containers: [{ name: 'foo', port: '3210:3000' }],
};

const getContextTemplate = () => ({ ...context });

test('Should run docker command', t => {
  mock('shelljs', {
    exec: cmd => {
      t.is(cmd, 'docker run  -d -p 3210:3000 -v /foo:/app --network local-test --name foo foo npm run dev');
    },
    echo: () => {
      // noop
    },
  });
  mock('fs', {
    access: (file, mode, cb) => {
      cb(null);
    },
    constants: { F_OK: 1 },
  });
  mock.reRequire('../helpers/run_container');
  sut = mock.reRequire('../operations/run');
  sut(getContextTemplate(), containerName);

  mock.stop('shelljs');
  mock.stop('fs');
});

test('Should bind to container port 3000 if shorthand mapping is provided', t => {
  mock('shelljs', {
    exec: cmd => {
      t.assert(cmd.indexOf('3210:3000') > -1);
    },
    echo: () => {
      // noop
    },
  });
  mock('fs', {
    access: (file, mode, cb) => {
      cb(null);
    },
    constants: { F_OK: 1 },
  });
  mock.reRequire('../helpers/run_container');
  sut = mock.reRequire('../operations/run');
  const ctx = getContextTemplate();
  ctx.containers[0].port = '3210';

  sut(ctx, containerName);

  mock.stop('shelljs');
  mock.stop('fs');
});

test('Should override cmd if provided', t => {
  mock('shelljs', {
    exec: cmd => {
      t.assert(cmd.indexOf('custom command') > -1);
    },
    echo: () => {
      // noop
    },
  });
  mock('fs', {
    access: (file, mode, cb) => {
      cb(null);
    },
    constants: { F_OK: 1 },
  });
  mock.reRequire('../helpers/run_container');
  sut = mock.reRequire('../operations/run');

  const ctx = getContextTemplate();
  ctx.containers[0].cmd = 'custom command';
  sut(ctx, containerName);

  mock.stop('shelljs');
  mock.stop('fs');
});

test('Should map env to -e flags', t => {
  mock('shelljs', {
    exec: cmd => {
      t.assert(cmd.indexOf('-e foo=1 -e bar=2') > -1);
    },
    echo: () => {
      // noop
    },
  });
  mock('fs', {
    access: (file, mode, cb) => {
      cb(null);
    },
    constants: { F_OK: 1 },
  });
  mock.reRequire('../helpers/run_container');
  sut = mock.reRequire('../operations/run');
  const ctx = getContextTemplate();
  ctx.containers[0].env = [{ foo: 1 }, { bar: 2 }];

  sut(ctx, containerName);

  mock.stop('shelljs');
  mock.stop('fs');
});

test('Should have source folder as a volume', t => {
  mock('shelljs', {
    exec: cmd => {
      t.assert(cmd.indexOf('-v /foo:/app') > -1);
    },
    echo: () => {
      // noop
    },
  });
  mock('fs', {
    access: (file, mode, cb) => {
      cb(null);
    },
    constants: { F_OK: 1 },
  });
  mock.reRequire('../helpers/run_container');
  sut = mock.reRequire('../operations/run');

  sut(getContextTemplate(), containerName);

  mock.stop('shelljs');
  mock.stop('fs');
});

test('Should not mount volume if volume is false.', t => {
  mock('shelljs', {
    exec: cmd => {
      t.assert(cmd.indexOf('-v /foo:/app') === -1);
    },
    echo: () => {
      // noop
    },
  });
  mock('fs', {
    access: (file, mode, cb) => {
      cb(null);
    },
    constants: { F_OK: 1 },
  });
  mock.reRequire('../helpers/run_container');
  sut = mock.reRequire('../operations/run');
  const ctx = getContextTemplate();
  ctx.containers[0].volume = false;
  sut(ctx, containerName);

  mock.stop('shelljs');
  mock.stop('fs');
});
