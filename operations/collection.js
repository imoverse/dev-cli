const runContainer = require('../helpers/run_container');
const startExternal = require('./startExternal');

module.exports = (context, search) => {
  const collection = Object.keys(context.collections).find(c => c.indexOf(search) >= 0);
  if (!collection) {
    console.log(`Could not find any collection matching '${search}'. Available collections are: ${Object.keys(context.collections).join(', ')}`);
    return;
  }
  const containerList = context.collections[collection];
  containerList.forEach(c => {
    const config = context.containers.find(p => p.name === c);
    if (config) {
      runContainer(context, config);
      return;
    }
    startExternal(context, c);
  });
};
