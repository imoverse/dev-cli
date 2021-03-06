const path = require('path');
const yaml = require('yaml');
const getFileContent = require('./get_file_content');

const getCurrentContainer = context => {
  const currentPath = process.cwd();
  const relativePath = currentPath.substr(context.root.length + 1);
  let container;
  if (relativePath.indexOf('/') === -1) {
    container = relativePath;
  } else {
    container = relativePath.substr(0, relativePath.indexOf('/'));
  }
  if (context.containers.find(c => c.name === container)) {
    return container;
  }
  return null;
};

module.exports = (operation, options) => {
  const dirSeperator = process.platform === 'win32' ? '\\' : '/';
  const cwd = process.cwd();
  const parentFolders = cwd.split(path.sep);

  while (parentFolders.length > 0) {
    const currentPath = `${parentFolders.join(dirSeperator)}`;
    const currentFile = `${currentPath}${dirSeperator}.dev`;
    const content = getFileContent(currentFile);

    if (content) {
      const context = yaml.parse(content);
      context.root = currentPath;
      context.currentContainer = getCurrentContainer(context);
      const applyPath = (relativePath = '') => repo => ({ ...repo, path: `${context.root}/${relativePath}${repo.name}` });
      context.containers = (context.containers || []).map(applyPath());
      context.web = (context.web || []).map(applyPath());
      context.packages = (context.packages || []).map(applyPath('packages/'));
      context.otherRepos = (context.otherRepos || []).map(applyPath());
      context.vars = (context.vars || {});
      context.operation = operation;
      context.options = options;
      return context;
    }
    parentFolders.pop();
  }

  throw new Error(`Could not find dev root in ${process.cwd()} or any of it's parent directories.`);
};
