const prompts = require('prompts');
const copy = require('handlebars-copy');

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
      message: 'Test: Username for the database user. This should be unique to the service',
    },
    {
      type: 'text',
      name: 'prodDbPassword',
      message: 'Test: Password for the database user. This should be unique to the service',
    },
  ];

  prompts(questions)
    .then(values => {
      console.log(values);
      copy(`${__dirname}/../templates/service`, process.cwd(), values);
    });
};
