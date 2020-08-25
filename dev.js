#!/usr/bin/env node

const getArgs = require('./helpers/get_args');
const operations = require('./operations');
const args = getArgs();

if (args.operation === 'help') {
  operations.help();
  return;
}

if (args.operation === 'initDevContext') {
  operations.initDevContext.apply(null, args.options);
  return;
}

if (args.operation === 'init') {
  operations.init.apply(null, args.options);
  return;
}

let context;
try {
  const getContext = require('./helpers/get_context');
  context = getContext();
} catch (err) {
  console.log(err.message);
  process.exit(4);
}

if (args.operation) {
  if (operations[args.operation]) {
    context["options"] = args.options;
    operations[args.operation].apply(null, [context].concat(args.options));
  } else {
    console.error('Invalid operation: ' + args.operation + '. (Available operations are: ' + Object.keys(operations).join(', ') + ')');
  }
} else {
  console.log(context, args);
}
