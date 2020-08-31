const shell = require('shelljs');

const getArgs = () => {
  const args = process.argv;

  for (let i = 0, l = args.length; i < l; i += 1) {
    if (args[i].includes('dev')) {
      return {
        operation: args[i + 1],
        options: args.slice(i + 2),
      };
    }
  }

  shell.echo('Unable to locate app argument (dev)');
  return null;
};

module.exports = getArgs;
