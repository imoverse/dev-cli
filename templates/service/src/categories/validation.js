const yup = require('yup');
const { validate } = require('../lib');

const categoriesSchema = yup.object().shape({
  id: yup.string().required('Category id missing').strict(),
  name: yup.string().required('Category name missing').strict(),
  description: yup.string('Description must be a string').strict(),
  tenantId: yup.string().required('Tenant id missing').strict(),
  created: yup.string('Created must be a string').strict(),
  updated: yup.string('Created must be a string').strict(),
  imageId: yup.string('Created must be a string').nullable().strict(),
});

exports.validateAddCategory = (_, { locals }) => validate(categoriesSchema, locals.mappedBody);

exports.validateUpdateCategory = ({ params, body }) =>
  validate(categoriesSchema, { ...params, ...body });
