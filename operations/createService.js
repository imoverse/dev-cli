const prompts = require('prompts');
const copy = require('handlebars-copy');
const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');

const encodeBase64 = str => Buffer.from(str).toString('base64');

const getValues = (values, context) => {
  const prodDbPassword = encodeBase64(values.prodDbPwd);
  const testDbPassword = encodeBase64(values.testDbPwd);
  const [pgAdminUserTest, pgAdminPasswordTest] = context.vars.pgAdminUserTest.split('/');
  const [pgAdminUserProd, pgAdminPasswordProd] = context.vars.pgAdminUserProd.split('/');
  const mqPasswordTest = context.vars.mqPasswordTest;
  const mqPasswordProd = context.vars.mqPasswordProd;
  return { 
    prodDbPassword,
    testDbPassword,
    pgAdminPasswordProd,
    pgAdminPasswordTest,
    pgAdminUserProd,
    pgAdminUserTest,
    mqPasswordTest,
    mqPasswordProd,
    ...values
  };
}

module.exports = (context) => {
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
      name: 'audience',
      message: 'What is the audience for this service?',
    },
    {
      type: 'text',
      name: 'primaryResource',
      message: 'Name of the first resource the service will handle.',
      initial: process.cwd().split(/(\/|\\)/).pop(),
    },
    {
      type: 'password',
      name: 'testDbPwd',
      message: 'Test: Password for the database user. This should be unique to the service',
    },
    {
      type: 'password',
      name: 'prodDbPwd',
      message: 'Prod: Password for the database user. This should be unique to the service',
    },
  ];

  prompts(questions)
    .then(async values => {
      const input = getValues(values, context);

      await copy(`${__dirname}/../templates/service`, process.cwd(), input);

      try {
        fs.renameSync('./src/[resource]', `./src/${values.primaryResource}`);
        fs.renameSync('./env', './.env');
      } catch (ex) {
        shell.echo(chalk`{red: ERROR renaming files}
          You will need to rename src/[resource] and ./env yourself
`);
      }
      shell.echo(chalk`{green ...done} The following files where added:
`);
      shell.exec('ls -a');
    });
};
