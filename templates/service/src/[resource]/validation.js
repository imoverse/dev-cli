const yup = require('yup');
const { validate } = require('../lib');

const categoriesSchema = yup.object().shape({
  id: yup.string().required('{{resource}} id missing').strict(),
  tenantId: yup.string().required('Tenant id missing').strict(),
  created: yup.string('Created must be a string').strict(),
  updated: yup.string('Updated must be a string').strict(),
});

exports.validateAddCategory = (_, { locals }) => validate(categoriesSchema, locals.mappedBody);

exports.validateUpdateCategory = ({ params, body }) =>
  validate(categoriesSchema, { ...params, ...body });
