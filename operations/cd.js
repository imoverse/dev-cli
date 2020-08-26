const { findAndApply } = require('../helpers/find');

module.exports = (context, search) => {
  const match = findAndApply(context, search, (_, { path }) => path);
  console.log(match || context.root);
};
