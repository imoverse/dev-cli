const chalk = require('chalk');
const shell = require('shelljs');

module.exports = () => {
  shell.echo(chalk`
{blue ${chalk.bold('Arguments')}:}
  The available operations are listed. Most operations can take a string as an additional argument. The containers are matched against this string and the first match is returned.
  Example: {bgGray ${chalk.green('dev build subscr')}} results in building the subscription-api whereas {bgGray ${chalk.green('dev build all')}} iterates over all containers and build them.
  If the search is omitted, the search will be aggregated from the current working directory.

{blue ${chalk.bold('Operations')}:}

  {green clone:}          Clones all repositories. If an argument is given, the first 
                  matching repository is cloned. Support {gray [search] and [all]. Default [.]}

  {green pull:}           Update all source code with git pull. Support {gray [search] and [all]. Default [.]}

  {green build:}          Build container. Support {gray [search] and [all]. Default [.]}

  {green init:}           WIP: Setup entire dev development.

  {green run:}            Start container. Port may be exposed based om context. Support {gray [search] and [all]. Default [.]}

  {green stop:}           Stop container(s). Support {gray [search] and [all]. Default [.]}

  {green brs:}            Shortcut for build and restart. Support {gray [search] and [all]. Default [.]}

  {green install:}        Install npm dependencies. Support {gray [search] and [all]. Default [.]}

  {green createNetwork:}  The containers are isolated in it's own network which 
                  is created by running createNetwork.

  {green startExternal:}  If a third-party container is required, it can be started 
                  using startExternal. Keep in mind that these containers 
                  also has to be present in the context.

  {green dbMigration:}   Run database migrations in intermediate container. Support {gray [search] and [all]. Default [.]}

  {green init:}           Update all source code with git pull.

  {green createService:}  Create a new service from an included template. Create an empty folder and enter it before  
                  running the command.

  {green kns:}            Set the Kubernetes cluster based on the environment name.

  {green klogs:}          Print the log of the mathcing container in the kubernetes cluster.

  {green kenv:}           List the environment vars for the matching pod

  {green pods:}           List the pods for the current namespace

  {green ksh:}            Get a shell into the matching pod. Only the command is 
                  output, it has to be copied and run manually.

  {green kproxy:}         Create a proxy to the kubernetes instance of matching container

  `);
};
