const prompts = require('prompts');
const copy = require('handlebars-copy');
const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');

module.exports = () => {
  const questions = [
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name?',
      initial: process.cwd().split(/(\/|\\)/).pop(),
    },
    {
      type: 'text',
      name: 'desription',
      message: 'Project descrioption:?',
      initial: 'imove plattform service',
    },
    {
      type: 'text',
      name: 'primaryResource',
      message: 'Name of the first resource the service will handle.',
      initial: process.cwd().split(/(\/|\\)/).pop(),
    },
    {
      type: 'text',
      name: 'testDbUser',
      message: 'Test: Username for the database user. This should be unique to the service',
    },
    {
      type: 'text',
      name: 'testDbPassword',
      message: 'Test: Password for the database user. This should be unique to the service',
    },
    {
      type: 'text',
      name: 'prodDbUser',
      message: 'Prod: Username for the database user. This should be unique to the service',
    },
    {
      type: 'text',
      name: 'prodDbPassword',
      message: 'Prod: Password for the database user. This should be unique to the service',
    },
  ];

  prompts(questions)
    .then(async values => {
      await copy(`${__dirname}/../templates/service`, process.cwd(), values);
      fs.rename('./src/[resource]', `./src/${values.primaryResource}`, () => { 
        shell.echo(chalk`{green ...done} The following files where added:
        `);
        shell.exec('ls');
      });
    });
};
