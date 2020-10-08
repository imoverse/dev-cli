const yup = require('yup');
const { serverValidate, validateDateStr} = require('@imoverse/skapet');

yup.addMethod.apply(null, validateDateStr);

const {{primaryResourcePlural}}Schema = yup.object().shape({
  id: yup.string().required('{{primaryResourceSingular}} id missing').strict(),
  tenantId: yup.string().required('Tenant id missing').strict(),
  created: yup.string('Created must be a string').dateStr('Created must be a valid date string').strict(),
  updated: yup.string('Updated must be a string').dateStr('Created must be a valid date string').strict(),
});

exports.validateAdd{{primaryResourceSingularUcFirst}} = (_, { locals }) => serverValidate({{primaryResourcePlural}}Schema, locals.mappedBody);

exports.validateUpdate{{primaryResourceSingularUcFirst}} = ({ params, body }) =>
serverValidate({{primaryResourcePlural}}Schema, { ...params, ...body });
