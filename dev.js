#!/usr/bin/env node

const getArgs = require('./helpers/get_args');
const operations = require('./operations');
const { operation, options } = getArgs();

const fetchContext = () => {
  try {
    const getContext = require('./helpers/get_context');
    return getContext(operation, options);
  } catch (err) {
    console.log(err.message);
    process.exit(4);
  }
}

switch (operation) {
  case undefined:
  case '':
    console.log(fetchContext());
    break;
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
    const context = fetchContext();
    
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
