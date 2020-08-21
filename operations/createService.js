const prompts = require('prompts');
const copy = require('handlebars-copy');

module.exports = (context) => {
  const questions = [
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name?',
      initial: process.cwd().split(/(\/|\\)/).pop()
    },
    {
      type: 'text',
      name: 'desription',
      message: 'Project descrioption:?',
      initial: `imove plattform service`
    },
    {
      type: 'list',
      name: 'entities',
      message: 'Entities (primary, [seconday], [secondary]...):'
    }
  ];


  prompts(questions)
  .then((values) => {
    console.log(values);
    copy(`${__dirname}/../templates/service`, process.cwd(), values);
  });  
};
