const chalk = require('chalk');
const shell = require('shelljs');

const find = (collection, search) => {
  const match = collection.find(item => {
    if (item.name.indexOf(search) > -1) {
      return true;
    }
    return false;
  });
  return match;
};

const getSearchFromCwd = () => {
  const cwd = process.cwd();
  const parts = cwd.split(/(\/|\\)/);

  return parts.pop();
};

const findAndApply = (context, search, func, options = {}) => {
  if (search === 'all') {
    if (options.onlyContainers) {
      return context.containers.map(repo => func(context, repo));
    }
    if (options.onlyPackages) {
      return context.packages.map(repo => func(context, repo));
    }
    if (options.onlyOthers) {
      return context.otherRepos.map(repo => func(context, repo));
    }

    const all = context.containers
      .concat(context.packages)
      .concat(context.otherRepos)
      .concat(context.web);
    return all.map(repo => func(context, repo));
  }

  if (!options.onlyOthers && !options.onlyPackages) {
    const container = find(context.containers.concat(context.web), search || getSearchFromCwd());
    if (container) {
      return func(context, container);
    }
  }

  if (!options.onlyOthers && !options.onlyContainers) {
    const pkg = find(context.packages, search || getSearchFromCwd());
    if (pkg) {
      return func(context, pkg);
    }
  }

  if (!options.onlyPackages && !options.onlyContainers) {
    const other = find(context.otherRepos, search || getSearchFromCwd());
    if (other) {
      return func(context, other);
    }
  }
  shell.echo(chalk`Could not find anything matching {blue "${search}"}`);
  return null;
};

module.exports = {
  findAndApply,
};
