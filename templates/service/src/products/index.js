const { handlers, events } = require('./events');

exports.productRouter = require('./routes');
exports.productHandlers = handlers;
exports.productEvents = events;
