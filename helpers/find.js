const find = (collection, search) => {
  const match = collection.find((item) => {
    if(item.name.indexOf(search) > -1) {
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
}

const container = (context, search) => {
  return find(context.containers, search);
};

const package = (context, search) => {
  return find(context.packages, search);
};

const otherRepo = (context, search) => {
  return find(context.otherRepos, search);
};

const findAndApply = (context, search, func, options = {}) => {
  if (search === 'all') {
    if (options.onlyContainers) {
      return context.containers.map((r) => func(context, r));
    }
    if (options.onlyPackages) {
      return context.packages.map((r) => func(context, r));
    }
    if (options.onlyOthers) {
      return context.otherRepos.map((r) => func(context, r));
    }

    const all = context.containers.concat(context.packages).concat(context.otherRepos);
    return all.map((r) => func(context, r));
  }

  if (!options.onlyOthers && !options.onlyPackages) {
    const container = find(context.containers, search || getSearchFromCwd());
    if (container) {
      return func(context, container);
    }
  }
  
  if (!options.onlyOthers && !options.onlyContainers) {
    const package = find(context.packages, search || getSearchFromCwd());
    if (package) {
      return func(context, package);
    }
  }

  if (!options.onlyPackages && !options.onlyContainers) {
    const other = find(context.otherRepos, search || getSearchFromCwd());
    if (other) {
      return func(context, other);
    }
  }
}

module.exports = { 
  container,
  package,
  otherRepo,
  findAndApply,
};
