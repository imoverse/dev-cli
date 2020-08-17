const { container: findContainer, package: findPackage, otherRepo: findOtherRepo } = require('../helpers/find');
const shell = require('shelljs');

module.exports = (context, op = 'clone', search) => {

  const cloneRepo = (name, root = context.root) => {
    const target = `${root}/${name}`;
    const cmd = `git clone ${context.gitBasePath}/${name}.git ${target}`;
    shell.echo(cmd)
    shell.exec(cmd);
  };

  const pullRepo = (name, root = context.root) => {
    const target = `${root}/${name}`;
    const cmd = `git -C ${target} pull --rebase`;
    shell.echo(cmd)
    shell.exec(cmd);
  };
  const fn = op === 'clone' ? cloneRepo : pullRepo;

  if (search) {
    const container = findContainer(context, search);
    if (container) {
      fn(container.name);
    } else {
      const package = findPackage(context, search);
      if (package) {
        fn(package.name, `${context.root}/packages`);
      } else {
        const otherRepo = findOtherRepo(context, search);
        if (otherRepo) {
          fn(otherRepo.name);
        }else {
          console.error(`Could not find container matching '${search}'`);
        }
      }
    }
    return;
  }

  context.containers.forEach(({ name }) => {
    fn(name);
  });
  context.packages.forEach(({ name }) => {
    fn(name, `${context.root}/packages`);
  });
  context.otherRepos.forEach(({ name }) => {
    fn(name);
  });
}
