const test = require('ava');
const { findAndApply } = require('../helpers/find');

const context = {
  name: 'local-test',
  root: '',
  options: [],
  containers: [{ name: 'cont1' }],
  packages: [{ name: 'pack1' }],
  otherRepos: [{ name: 'other1' }],
  web: [{ name: 'web1' }],
};

const getContextTemplate = () => ({ ...context });

test('findAndApply should run function on found repo', t => {
  findAndApply(context, 'pa', (ctx, repo) => {
    t.is(ctx, context);
    t.is(repo.name, 'pack1');
  });
});

test('findAndApply should run on all repos if search is all', t => {
  const result = ['cont1', 'pack1', 'other1', 'web1'];
  let index = 0;
  findAndApply(context, 'all', (ctx, repo) => {
    t.is(repo.name, result[index]);
    index += 1;
  });
});

test('findAndApply should run on all containers if onlyContainers flag is set', t => {
  const result = ['cont1'];
  let index = 0;
  findAndApply(context, 'all', (ctx, repo) => {
    t.is(repo.name, result[index]);
    index += 1;
  }, { onlyContainers: true });
  t.is(index, 1);
});

test('findAndApply should run on all packages if onlyPackages flag is set', t => {
  const result = ['pack1'];
  let index = 0;
  findAndApply(context, 'all', (ctx, repo) => {
    t.is(repo.name, result[index]);
    index += 1;
  }, { onlyPackages: true });
  t.is(index, 1);
});

test('findAndApply should run on all other repos if onlyOthers flag is set', t => {
  const result = ['other1'];
  let index = 0;
  findAndApply(context, 'all', (ctx, repo) => {
    t.is(repo.name, result[index]);
    index += 1;
  }, { onlyOthers: true });
  t.is(index, 1);
});

test('findAndApply should run on matching package if onlyPackages flag is set', t => {
  let index = 0;
  const ctx = getContextTemplate();
  findAndApply(ctx, 'pac', (c, repo) => {
    t.is(repo.name, 'pack1');
    index += 1;
  }, { onlyPackages: true });
  t.is(index, 1);
});

test('findAndApply should run on matching other if onlyOthers flag is set', t => {
  let index = 0;
  const ctx = getContextTemplate();
  ctx.containers.push({ name: 'other2' });
  findAndApply(ctx, 'oth', (c, repo) => {
    t.is(repo.name, 'other1');
    index += 1;
  }, { onlyOthers: true });
  t.is(index, 1);
});

test('findAndApply should default to cwd if search is not supplied', t => {
  const originalCwd = process.cwd;

  process.cwd = () => '/home/foo/dev/other1';

  let index = 0;
  findAndApply(context, false, (ctx, repo) => {
    index += 1;
    t.is(repo.name, 'other1');
  });
  t.is(index, 1);
  process.cwd = originalCwd;
});
