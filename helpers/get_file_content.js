const fs = require('fs');

const getFileContents = file => {
  try {
    return fs.readFileSync(file, 'utf-8');
  } catch (ex) {
    return false;
  }
};

module.exports = getFileContents;
