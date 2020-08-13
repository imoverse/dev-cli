const collection = require('./collection');
const clone = require('./clone');
const pull = require('./pull');
const build = require('./build');
const run = require('./run');
const stop = require('./stop');
const cd = require('./cd');
const createNetwork = require('./createNetwork');
const startExternal = require('./startExternal');
const kns = require('./kns');
const klogs = require('./klogs');
const help = require('./help');
const installDependencies = require('./installDependencies');
const runDatabaseMigration = require('./runDatabaseMigration');
const ksh = require('./ksh');
const kproxy = require('./kproxy');
const kenv = require('./kenv');
const kpods = require('./kpods');
const getVariables = require('./getVariables');
const setupDb = require('./setupDb');
const updateEnv = require('./updateEnv');

const operations = {
  clone,
  pull,
  build,
  run,
  stop,
  cd,
  createNetwork,
  startExternal,
  kns,
  klogs,
  c: collection,
  collection,
  install: installDependencies,
  i: installDependencies,
  '-h': help,
  help,
  ksh,
  kproxy,
  kenv,
  pods: kpods,
  kpods,
  getVariables,
  setupDb,
  dbMigrations: runDatabaseMigration,
  runDatabaseMigration,
  updateEnv,
  brs: (context, search) => {
    build(context, search);
    stop(context, search);
    run(context, search);
  },
  init: (context) => {
    clone(context);
    createNetwork(context);
    installDependencies(context);
    build(context, 'all');
    runDatabaseMigration();
  },
};

module.exports = operations;
