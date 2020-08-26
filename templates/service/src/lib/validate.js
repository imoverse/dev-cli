const { map, prop } = require('ramda');

const validate = (schema, model) => {
  try {
    schema.validateSync(model, { abortEarly: false });

    return { valid: true, errors: [] };
  } catch (err) {
    return { valid: false, errors: map(prop('message'), err.inner) };
  }
};

module.exports = validate;
