const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');

module.exports = ([ name = 'imove-dev', envFolder = process.env.IMOVE_ENV_FOLDER ? process.env.IMOVE_ENV_FOLDER : `${process.env.HOME}/Dropbox/imove-dev` ]) => {
  fs.access('./.dev', fs.constants.R_OK, (err) => {
    if (!err) {
      console.log(chalk`{red .dev already exist in this folder }`);
      return process.exit(1);
    }
    fs.access(`${envFolder}/${name}.dev`, fs.constants.R_OK, (err) => {
      if (err) {
        console.log(chalk`{red Could not find context file ${envFolder}/${name}.dev }`, err);
        return process.exit(1);
      }
      const cmd = `ln -s ${envFolder}/${name}.dev ./.dev`;
      shell.exec(cmd);
    });
  });
};
