const find = (collection, search) => {
  const match = collection.find((item) => {
    if(item.name.indexOf(search) > -1) {
      return true;
    }
    return false;
  });
  return match;
};


const container = (context, search) => {
  return find(context.containers, search);
};

const package = (context, search) => {
  return find(context.packages, search);
};

const otherRepo = (context, search) => {
  return find(context.otherRepos, search);
};

const findAndApply = (context, search, func) => {
  const container = find(context.containers, search);
  if (container) {
    return func(context, container);
  }
  const package = find(context.packages, search);
  if (package) {
    return func(context, package);
  }
  const other = find(context.otherRepos, search);
  if (other) {
    return func(context, other);
  }
}

module.exports = { 
  container,
  package,
  otherRepo,
  findAndApply,
};
