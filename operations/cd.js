const { container: findContainer } = require('../helpers/find');

module.exports = (context, search) => {
  if (!context) {
    console.error('Missing context');
    return;
  }

  const match = findContainer(context, search);

  if (match) {
    console.log(`${context.root}/${match.name}`);
    return;
  }
  console.log(context.root);
};
