const chalk = require('chalk');
const shell = require('shelljs');

module.exports = () => {
  console.log(chalk`
{blue ${chalk.bold('Arguments')}:}
  The available operations are listed. Most operations can take a string as an additional argument. The containers are matched against this string and the first match is returned.
  Example: {bgGray ${chalk.green('dev build subscr')}} results in building the subscription-api whereas {bgGray ${chalk.green('dev build')}} iterates over all containers and build them.

{blue ${chalk.bold('Operations')}:}

  {green clone:}          Clones all repositories. If an argument is given, the first 
                  matching repository is cloned.

  {green pull:}           Update all source code with git pull.

  {green build:}          Build container.

  {green run:}            Start container. Port may be exposed based om context.

  {green createNetwork:}  The containers are isolated in it's own network which 
                  is created by running createNetwork.

  {green startExternal:}  If a third-party container is required, it can be started 
                  using startExternal. Keep in mind that these containers 
                  also has to be present in the context.

  {green kns:}            Set the Kubernetes cluster based on the environment name.

  {green klogs:}          Print the log of the mathcing container in the kubernetes cluster.

  `);
  
};
