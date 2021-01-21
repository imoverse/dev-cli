const yup = require('yup');
const { serverValidate, validateDateStr } = require('@imoverse/validation');

yup.addMethod.apply(null, validateDateStr);

const {{primaryResourcePlural}}Schema = yup.object().shape({
  tenantId: yup.string().required('Tenant id missing').strict(),
  created: yup.string('Created must be a string').dateStr('Created must be a valid date string').strict(),
  updated: yup.string('Updated must be a string').dateStr('Created must be a valid date string').strict(),
});

exports.validateAdd{{primaryResourceSingularUcFirst}} = ({ body }, { locals }) =>
  serverValidate({{primaryResourcePlural}}Schema, { ...body, tenantid: locals.tenantId });

exports.validateUpdate{{primaryResourceSingularUcFirst}} = ({ body }, { locals }) =>
  serverValidate({{primaryResourcePlural}}Schema, { ...body, tenantid: locals.tenantId });
