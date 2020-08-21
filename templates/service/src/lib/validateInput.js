const { curry } = require('ramda');
const log = require('@imoverse/logger');

const handleValidationError = curry(
  (res, errors) => {
    const errorsJson = JSON.stringify(errors);
    log.error(`Input validation failed: ${errorsJson}`);
    res.status(400).send(errorsJson);
  },
);

const validateInput = curry(
  (validator, req, res, next) => {
    const { valid, ...errors } = validator(req, res);

    return valid
      ? next()
      : handleValidationError(res, errors);
  },
);

module.exports = validateInput;
