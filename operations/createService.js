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
  const { mqPasswordTest, mqPasswordProd } = context.vars;
  const primaryResourceSingularUcFirst = `${values.primaryResourceSingular[0].toUpperCase()}${values.primaryResourceSingular.slice(1)}`;
  const primaryResourceSingularUc = values.primaryResourceSingular.toUpperCase();
  const primaryResourcePluralUcFirst = `${values.primaryResourcePlural[0].toUpperCase()}${values.primaryResourcePlural.slice(1)}`;
  const primaryResourcePluralUc = values.primaryResourcePlural.toUpperCase();

  return {
    prodDbPassword,
    testDbPassword,
    pgAdminPasswordProd,
    pgAdminPasswordTest,
    pgAdminUserProd,
    pgAdminUserTest,
    mqPasswordTest,
    mqPasswordProd,
    primaryResourceSingularUcFirst,
    primaryResourceSingularUc,
    primaryResourcePluralUcFirst,
    primaryResourcePluralUc,
    ...values,
  };
};

module.exports = context => {
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
      name: 'primaryResourcePlural',
      message: 'Name of the first resource the service will handle in plural form',
    },
    {
      type: 'text',
      name: 'primaryResourceSingular',
      message: 'Name of the first resource the service will handle in singular form',
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
      shell.echo(input);
      await copy(`${__dirname}/../templates/service`, process.cwd(), input);

      try {
        fs.renameSync('./src/[resource]', `./src/${values.primaryResourcePlural}`);
        fs.renameSync('./env', './.env');
      } catch (ex) {
        shell.echo(chalk`{red: ERROR renaming files}
          You will need to rename src/[resource] and ./env yourself
`);
      }
      shell.echo(chalk`{green ...done} The following files where added:
`);
      shell.exec('ls -a');
      shell.echo(chalk`

{blue Now what?}
  1. Create github-repository: {green https://github.com/organizations/imoverse/repositories/new}
  2. Add the imoverse/imove team as admins to the repo: (green https://github.com/imoverse/${values.projectName}/settings/access)
  3. Add repository secrets: {green https://github.com/imoverse/${values.projectName}/settings/secrets}
    ACR_PASSWORD, MILESCLOUD_REGISTRY_PASSWORD, NPM_TOKEN, PROD_CLIENT_SECRET, TEST_CLIENT_SECRET
  4. Add repo to #ops in Slack: {green /github subscribe https://github.com/imoverse/${values.projectName}}
  5. Search for TODO in the repo and replace values and implement stuff.
  6. If applicable, the service needs to be added to HAProxy in the imove-setup repo.
` // eslint-disable-line comma-dangle
      ); // eslint-disable-line function-paren-newline
    });
};
