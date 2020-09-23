const collection = require('./collection');
const git = require('./git');
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
const dbMigration = require('./dbMigration');
const ksh = require('./ksh');
const kproxy = require('./kproxy');
const kenv = require('./kenv');
const kpods = require('./kpods');
const getVariables = require('./getVariables');
const updateEnv = require('./updateEnv');
const initDevContext = require('./initDevContext');
const createService = require('./createService');
const getContext = require('../helpers/get_context');
const dbFile = require('./dbFile');

const operations = {
  init: (project, envFolder) => {
    initDevContext(project, envFolder);
    const context = getContext('init');
    git(context, 'clone', 'all');
    createNetwork(context);
    updateEnv(context);
    startExternal(context, 'imove-pg');
    installDependencies(context, 'all');
    build(context, 'all');
    dbMigration(context, 'all');
  },
  initDevContext,
  updateEnv,
  clone: (context, search) => git(context, 'clone', search),
  pull: (context, search) => git(context, 'pull', search),
  build,
  run,
  stop,
  brs: (context, search) => {
    build(context, search);
    stop(context, search);
    run(context, search);
  },
  install: installDependencies,
  i: installDependencies,
  collection,
  c: collection,
  createNetwork,
  startExternal,
  dbMigration,
  dbFile,
  createService,
  kns,
  klogs,
  kenv,
  kpods,
  pods: kpods,
  ksh,
  kproxy,
  getVariables,
  '-h': help,
  help,
  cd,
};

module.exports = operations;
