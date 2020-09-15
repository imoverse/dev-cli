#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-case-declarations */

const getArgs = require('./helpers/get_args');
const operations = require('./operations');
const getContext = require('./helpers/get_context');
const { operation, options } = getArgs();

const fetchContext = () => {
  try {
    return getContext(operation, options);
  } catch (err) {
    console.log(err.message);
    process.exit(4);
  }
};

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
    const context = fetchContext();

    if (operation) {
      if (operations[operation]) {
        operations[operation].apply(null, [context].concat(options));
      } else {
        console.error(`Invalid operation: ${operation}. (Available operations are: ${Object.keys(operations).join(', ')})`);
      }
    } else {
      console.log(context);
    }
}
