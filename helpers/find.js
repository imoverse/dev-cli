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

module.exports = { 
  container,
  package,
  otherRepo,
};
