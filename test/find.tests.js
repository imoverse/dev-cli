const test = require('ava');
const mock = require('mock-require');
let { container, package, otherRepo, findAndApply } = require('../helpers/find');

const context = {
  name: 'local-test',
  root: '',
  options: [],
  containers: [{ name: 'cont1' }],
  packages: [{ name: 'pack1' }],
  otherRepos: [{ name: 'other1' }],
};

const getContextTemplate = () => {
  return Object.assign({}, context);
};

test('Should find container', t => {
  const result = container(context, 'cont1');
  t.is(result.name, 'cont1');
});

test('Should find package', t => {
  const result = package(context, 'pack1');
  t.is(result.name, 'pack1');
});

test('Should find other', t => {
  const result = otherRepo(context, 'other1');
  t.is(result.name, 'other1');
});

test('Should support wildcard', t => {
  const c = container(context, 'co');
  t.is(c.name, 'cont1');

  const p = package(context, 'pa');
  t.is(p.name, 'pack1');

  const o = otherRepo(context, 'oth');
  t.is(o.name, 'other1');
});

test('findAndApply should run function on found repo', t => {
  findAndApply(context, 'pa', (ctx, repo) => {
    t.is(ctx, context);
    t.is(repo.name, 'pack1');
  });
});
