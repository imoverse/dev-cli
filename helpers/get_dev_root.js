const path = require('path');
const yaml = require('yaml');
const getFileContent = require('./get_file_content');

module.exports = function getDevRoot() {
  const dirSeperator = process.platform === 'win32' ? "\\" : '/';
  const cwd = process.cwd();
  const parentFolders = cwd.split(path.sep);

  while (parentFolders.length > 0) {
    const currentPath = `${parentFolders.join(dirSeperator)}`;
    const currentFile = `${currentPath}${dirSeperator}.dev`;
    let content;
    content = getFileContent(currentFile);

    if (content) {
      const context = yaml.parse(content);
      context.root = currentPath;
      return context;
    }
    parentFolders.pop();
  }

  throw new Error(`Could not find dev root in ${process.cwd()} or any of it's parent directories.`);
};
