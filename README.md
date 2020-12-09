# @imoverse/dev-cli

This is a highly opinionated tool for managing your dev environment when working with multiple docker containers in a micro service architecture using node.js with multiple repositories.

The tool provides conventient ways to build, start and stop containers during development with as little configuration needed as possible.

## Installation
`npm i -g @imoverse/dev-cli`

This will but the binary `dev` in your global npm packages folder.

## Use

Run `dev help` from the command line.

This package is recursively looking for a file called `.dev` in the current working directory, and the directories higher up the tree. When found, the data from `.dev` is loaded into an object called `context` in the tool.

## `.dev` - The developer context

The `.dev` file is yaml formatted with:
* The name of the project
* A list of environments and their Kubernetes contexts and namespaces
* A list of containers developed in the solution
* A list of external containers needed for the solution
* A list of collections of containers that may be run alone as a sub part of the solution.
* gitBasePath pointing to the location of the git repositories.

### `.dev` file example

```
name: dev-cli-demo

containers:
  - name: web
    port: 3000
  - name: login-application
    port: 3001
  - name: authentication
  - name: authorization

external:
  imove-pg:
    image: postgres
    port: 5432:5432
    volume:
      - db/pg:/var/lib/postgresql/data

collections:
  auth:
    - authentication
    - authorization
    - login-application

gitBasePath: git@github.com:imoverse

environments:
  - env: test
    ctx: kubernetes-context
    ns: kubernetes-namespace

```

### The `context` field

| Name        | Description           |
|---------------|--------------------|
| `name`      | Name of the project. This will also be the name of the docker network which all the containers will be started within. |
| `containers` | The list of containers that is developed in the solution. Each container has a field `name` and optionally `port` in order to specify which port(s) that should be exposed to the host. |
| `external` | The list of external containers that is part of the project |
| `collections` | As the project grows, it might not be nessessary to run all the containers in order to get the work done. The collections are lists of a number of containers that can be started alone. If you are working with auth, for example, you don't have to start up the entire system, but maybe the login application, the authorization service and the authentication service is enough. |
| `gitBasePath` | Used by the `clone` command |
| `environments` | List of environments and their Kubernetes context and namespace |
| `root` | This has the path to the `.dev` file. It is not part of the data in the file, but it is appended to the context object from the tool. |

### The `container` field

| Name        | Description           |
|---------------|--------------------|
| `name`      | The docker name of the container. Other containers can reach the container using `{name}` as the network name. I.e. if a container has the name `user-api` it can be requested using `http://user-api` if it runs an http service on port 80. |
| `ports` | A port mapping for the docker run command. The containers are using port 3000 as default, so a port value of 1337 would result in the mapping 1337:3000. If port has a mapping, it will be overridden, such as `1337:80` would expose the container port 80 to the host port of 1337. |

### The `external` field

The external field is a hash map of external containers where the name of the hash is the container name and the values is config data for the contianer.

| Name        | Description           |
|---------------|--------------------|
| `image`     | The name of the docker image which should be available when using the `docker pull` command. |
| `port` (optional)       | Port mapping for the `docker run` command. |
| `volume` (optional)   | A list of volume mappings for the `docker run` command. |

### The `collections` field

This is a hash map of collections, where the hash name is the collection name, and the value is a list of containers within the collection. The containers are identified by their names. All the containers must be listed in the containers field or the external field.

In the example above, by starting the auth collection, the login application and the auth* containers are started, whereas the web container is not.

### The `gitBasePath` field

The clone command clones the repos matching [gitBasePath]/[containerName]. Note that the container name thus must match the repository name. The gitBasePath for this repo would be `git@github.com:imoverse`.

If you want to use git+ssh, you will need to upload your ssh key for this to work.

### The `environments` field
This is a list of environments or Kubernetes contexts and namespaces to where the containers are deployed. Providing the Kubernetes values is required for the `kns` and `klogs` operations to work.

| Name        | Description           |
|---------------|--------------------|
| `env`       | Name of the environment |
| `ctx`       | Name of the Kubernetes context |
| `ns`        | Name of the Kubernetes namespace for the environment |

## Operations

This sections describe the available operations. Most of them follow the pattern `dev [operation] [filter]` where filter is optional. If a filter is provided, the first container matching the filter, is executed. Otherwise, the operation is executed on all the containers in the order specified in the context.

1. Build all the containers: `dev build`
2. Build only the web container: `dev build web`

### Print context
By simply running `dev`, the context, if found, is printed.

### `dev help` or `dev -h`

This output a simple help text describing the available operations.

### `dev clone [filter]`

Assuming all the containers will be available at gitBasePath/containerName, this will clone all the repositories into the dev root folder.

You will need to make sure these repositories are accessible from your computer in advance, as the command run is simply the `git clone` command.

### `dev pull [filter]``

This will run `git pull` on the current branch. There is no check for local changes, causing the command to fail.

### `dev build [filter]`

Assuming there is a `Dockerfile` in the root of each repository, this command will build the container. The container is named after `containerName`.

If no filter is supplied, the container in the current working directory is built. To build all containers, run `dev build all`.

### `dev run [filter]`

Run the container(s) in development mode. The default container command is overridden by `npm run dev`, and the source code of the repository is mounted into the `/app` directory of the container. This means that if you create a script in your `package.json` named `dev` which runs i.e. `nodemon` the internal process of the container will restart when a file changes, and you will be able to test, whichout having to rebuild the container. In my experience, this provides the fastest REPL working with these kinds of projects.

If no filter is supplied, the container in the current working directory is run. To run all containers, run `dev run all`.

### `dev stop [filter]`

Stop (or remove) the container.

If no filter is supplied, the container in the current working directory is stopped. To stop all containers, run `dev stop all`.

### `dev createNetwork`

This command simply creates a docker network named after the `context.name` value provided in the `.dev` file.

### `dev startExternal [containerName]`

Bacause external containers typically have more run options, a seperate command needs to be used for these containers. The container name is not optional and must be exactly matching the external container hash value.

### `dev kns [environment]`

Set the current Kubernetes namespace and context based on the values in the `environments` field in the context. Keep in mind that you need to have installed `kubectl`, `kubectx` and `kubens` in order to have this working. You will also need to make sure that you have access to the environments using these commands.

### `dev klogs [filter]`

Display the logs from container in the current Kubernetes namespace. Note that filter here matches the pod name, and not the container name, although they should be quite similar. The logs of the first (partly) matching container is shown.

### `dev kproxy [filter]`

Set up a proxy to the first matching pod. Port mapping is fetched from context.

### `dev kenv [filter]`

Print the environment variables for the first matching pod.

### `dev kpods` or `dev pods`

Alias for kubectl get pods.

### `dev ksh [filter]`

Print the command for setting up a shell to the first matching container. Because this cli runs a seperate shell process, creating a new interactive shell from the cli is not possible at the moment.

### `dev collection [filter]` or `dev c [filter]`
This will start all the containers in the first collection matching `filter`. The containers are started in the sequence given by the collection.

### `dev install [filter]` or `dev i [filter]`

BETA: Install dependencies for the container using `npm install`.

### `dev runDatabaseMigration [filter]`

BETA: Run `npm run knex-local`, which will run the knex database migration script for the container.

### `dev init`

Runs the following commands in sequence:
1. clone
2. createNetwork
3. install
4. runDatabaseMigration
5. build

### Bonus: `dev cd [filter]` and `d [filter]`

This command will output the exact path to the matching container. Adding the following function to `~/.bash_profile` will enable instant switching of the current directory from anywhere within the `.dev`-context to the source code of the matching container:

```
function d(){
  DIR=`dev cd $1`
  echo $DIR
  cd $DIR
}
```

This enables the use of `d authorizat` from anywhere within the `.dev`-context, and the current working directory is instantly changed to the authorization container's source code.
