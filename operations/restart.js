const { findAndApply } = require('../helpers/find');
const restartContainer = require('../helpers/restart_container');

module.exports = (context, search) => {
  findAndApply(context, search, (_, repo) =>
    restartContainer(context, repo),
  { onlyContainers: true });
};
