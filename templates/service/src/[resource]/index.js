const { handlers, events } = require('./events');

exports.{{primaryResourcePlural}}Router = require('./routes');
exports.{{primaryResourcePlural}}Handlers = handlers;
exports.{{primaryResourcePlural}}Events = events;
