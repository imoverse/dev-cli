const chalk = require('chalk');
const shell = require('shelljs');

module.exports = () => {
  shell.echo(chalk`
{blue ${chalk.bold('Arguments')}:}
  The available operations are listed. Most operations can take a string as an additional argument. The containers are matched against this string and the first match is returned.
  Example: {bgGray ${chalk.green('dev build subscr')}} results in building the subscription-api whereas {bgGray ${chalk.green('dev build all')}} iterates over all containers and build them.
  If the search is omitted, the search will be aggregated from the current working directory.

{blue ${chalk.bold('Operations')}:}

  {green init:}           Setup entire dev development: Init dev context, clone, setup docker, updateEnv start external
                  install dependencies, build containers and run db migrations.

  {green initDevContext:} Set up symbolic link to .dev file in current directory. Use default dropbox location or 
                  environment variable IMOVE_ENV_FOLDER.

  {green updateEnv:}      Copy env files for each container from default Dropbox location or IMOVE_ENV_FOLDER.

  {green clone:}          Clones all repositories. If an argument is given, the first 
                  matching repository is cloned. Support {gray [search] and [all]. Default [.]}

  {green pull:}           Update all source code with git pull. Support {gray [search] and [all]. Default [.]}

  {green build:}          Build container. Support {gray [search] and [all]. Default [.]}

  {green run:}            Start container. Port may be exposed based om context. Support {gray [search] and [all]. Default [.]}

  {green stop:}           Stop container(s). Support {gray [search] and [all]. Default [.]}

  {green brs:}            Shortcut for build and restart. Support {gray [search] and [all]. Default [.]}

  {green install:}        Install npm dependencies. Support {gray [search] and [all]. Default [.]}
  {green i:}              Alias for {gray install}

  {green collection:}     Run a named collection of multiple containers defined in {gray .dev}
  {green c:}              Alias for {gray collection}

  {green createNetwork:}  The containers are isolated in it's own network which 
                  is created by running createNetwork.

  {green startExternal:}  If a third-party container is required, it can be started using startExternal. Keep in mind that
                  these containers also has to be present in the context. {gray Default [all]}

  {green dbMigration:}   Run database migrations in intermediate container. Support {gray [search] and [all]. Default [.]}

  {green createService:}  Create a new service from an included template. Create an empty folder and enter it before  
                  running the command.

  {green kns:}            Set the Kubernetes cluster based on the environment name.

  {green klogs:}          Print the log of the mathcing container in the kubernetes cluster.

  {green kenv:}           List the environment vars for the matching pod

  {green kpods:}          List the pods for the current namespace
  {green pods:}           Alias for {gray kpods}

  {green ksh:}            Get a shell into the matching pod. Only the command is 
                  output, it has to be copied and run manually.

  {green kproxy:}         Create a proxy to the kubernetes instance of matching container

  {green getVariables:}   List the k8s variables from files in the k8s folder of the current container.

  {green help:}           You're here!
  {green -h:}             Alias for {gray help}.
  
  {green cd:}             Output the directory of the matching container. Requires {gray [search]}
  `);
};
