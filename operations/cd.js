const shell = require('shelljs');
const chalk = require('chalk');
const { findAndApply } = require('../helpers/find');

module.exports = (context, search) => {
  if (search === '?' || search === '-h') {
    shell.echo(`
You cannot change the current directory from a script like the dev-cli you are using now. However, you can create a shell 
function like this example for bash:`);

    shell.echo(chalk.green(`
function d(){
  DIR=\`dev cd $1\`
  echo $DIR
  cd $DIR
}
`));
    shell.echo(chalk`Put this in your ~/.bash_profile to enable {green d [repoName]} to quicky enter the matching folder.`);
  } else {
    const match = findAndApply(context, search, (_, { path }) => path);
    shell.echo(match || context.root);
  }
};
