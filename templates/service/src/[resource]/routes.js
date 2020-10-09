const express = require('express');
const log = require('@imoverse/logger');
const authorize = require('@imoverse/authorize');
const { curry } = require('ramda');
const { validateInput } = require('@imoverse/skapet');
const {{primaryResourcePlural}} = require('./db');
const { validateAdd{{primaryResourceSingularUcFirst}}, validateUpdate{{primaryResourceSingularUcFirst}} } = require('./validation');
const {
  publish{{primaryResourceSingularUcFirst}}Created,
  publish{{primaryResourceSingularUcFirst}}Updated,
  publish{{primaryResourceSingularUcFirst}}Deleted,
} = require('./events');
const { getTenantId, mapBodyWithTenantId } = require('../mappers');

const router = express.Router();

const handleError = curry(
  (res, err) => {
    log.error(err);
    res.sendStatus(500);
  },
);

router.get('/', getTenantId, (req, res) =>
{{primaryResourcePlural}}.all(res.locals.tenantId)
    .then(cats => res.send(cats))
    .catch(handleError(res)));

router.get('/:id', getTenantId, ({ params }, res) =>
{{primaryResourcePlural}}.find(params.id, res.locals.tenantId)
    .then({{primaryResourceSingular}} => res.send({{primaryResourceSingular}}))
    .catch(handleError(res)));

router.use(authorize());

router.post('/', mapBodyWithTenantId, validateInput(validateAdd{{primaryResourceSingularUcFirst}}), (_, res) =>
  publish{{primaryResourceSingularUcFirst}}Created(res.locals.mappedBody)
    .then(() =>
      res.sendStatus(201))
    .catch(handleError(res)));

router.put('/:id', validateInput(validateUpdate{{primaryResourceSingularUcFirst}}), ({ params, body }, res) =>
  publish{{primaryResourceSingularUcFirst}}Updated({ id: params.id, ...body })
    .then(() =>
      res.sendStatus(204))
    .catch(handleError(res)));

router.delete('/:id', getTenantId, ({ params }, res) =>
  publish{{primaryResourceSingularUcFirst}}Deleted(params.id, res.locals.tenantId)
    .then(() =>
      res.sendStatus(204))
    .catch(handleError(res)));

module.exports = router;
