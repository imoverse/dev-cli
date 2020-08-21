const { pipe } = require('ramda');
const mq = require('@imoverse/mq');

const publishEvent =
  pipe(
    (type, data) => ({ type, data }),
    mq.publish,
  );

module.exports = publishEvent;
