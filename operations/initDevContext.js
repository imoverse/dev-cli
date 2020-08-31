const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');

module.exports = (name = 'imove-dev', envFolder = process.env.IMOVE_ENV_FOLDER ? process.env.IMOVE_ENV_FOLDER : `${process.env.HOME}/Dropbox/imove-dev`) => new Promise(resolve => {
  fs.access('./.dev', fs.constants.R_OK, err => {
    if (!err) {
      shell.echo(chalk`{red .dev already exist in this folder }`);
      process.exit(1);
    }
    fs.access(`${envFolder}/${name}.dev`, fs.constants.R_OK, err2 => {
      if (err2) {
        shell.echo(chalk`{red Could not find context file ${envFolder}/${name}.dev }`, err2);
        process.exit(1);
      }
      const cmd = `ln -s ${envFolder}/${name}.dev ./.dev`;
      shell.echo(cmd);
      shell.exec(cmd);
      resolve();
    });
  });
});
