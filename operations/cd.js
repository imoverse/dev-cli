const { findAndApply } = require('../helpers/find');

module.exports = (context, search) => {
  const match = findAndApply(context, search, (_, repo) => {
    return `${context.root}/${repo.name}`;
  });
  console.log(match || context.root);
};
