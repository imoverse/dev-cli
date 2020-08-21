const yup = require('yup');
const { validate } = require('../lib');

const productsSchema = yup.object().shape({
  id: yup.string().required('Product id missing').strict(),
  name: yup.string().required('Product name missing').strict(),
  description: yup.string('Description must be a string').strict(),
  price: yup.number('Price must be a number').strict(),
  images: yup.array().of(yup.number()),
  tenantId: yup.string().required('Tenant id missing').strict(),
  created: yup.string('Created must be a string').strict(),
  updated: yup.string('Created must be a string').strict(),
  imageId: yup.string('Created must be a string').nullable().strict(),
});

exports.validateAddProduct = (_, { locals }) => validate(productsSchema, locals.mappedBody);

exports.validateUpdateProduct = ({ params, body }) =>
  validate(productsSchema, { ...params, ...body });
