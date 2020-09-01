#!/usr/bin/env node

const getArgs = require('./helpers/get_args');
const operations = require('./operations');
const { operation, options } = getArgs();

switch (operation) {
  case 'help':
    operations.help();
    break;

  case 'initDevContext':
    operations.initDevContext.apply(null, options);
    break;

  case 'init':
    operations.init.apply(null, options);
    break;

  default:
    let context;
    try {
      const getContext = require('./helpers/get_context');
      context = getContext(operation, options);
    } catch (err) {
      console.log(err.message);
      process.exit(4);
    }
    
    if (operation) {
      if (operations[operation]) {
        operations[operation].apply(null, [context].concat(options));
      } else {
        console.error('Invalid operation: ' + operation + '. (Available operations are: ' + Object.keys(operations).join(', ') + ')');
      }
    } else {
      console.log(context, args);
    }    
}
