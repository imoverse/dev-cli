const express = require('express');
const log = require('@imoverse/logger');
const { authorize, setTenantId, permissionCheck } = require('@imoverse/authorize');
const { findTenantId } = require('@imoverse/lib');
const { curry } = require('ramda');
const { validateInput } = require('@imoverse/validation');
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

//TODO: Should getters not need authorization in your service?

router.get('/', findTenantId, (req, res) =>
{{primaryResourcePlural}}.all(res.locals.tenantId)
    .then(cats => res.send(cats))
    .catch(handleError(res)));

router.get('/:id', findTenantId, ({ params }, res) =>
  (await {{primaryResourcePlural}}.find(params.id, res.locals.tenantId)).cata({
  Failure: handleError(res),
  Ok: {{primaryResourceSingular}} => {{primaryResourceSingular}}.cata(
    () => res.sendStatus(404),
    x => res.send(x),
  )
}));
    .then({{primaryResourceSingular}} => res.send({{primaryResourceSingular}}))
    .catch(handleError(res)));

router.use(authorize());
router.use(setTenantId);
//TODO: add appropriate permissions router.use(permissionCheck(['read:<resource>', 'write:<resource']));

router.post('/', mapTenantId, validateInput(validateAdd{{primaryResourceSingularUcFirst}}), (_, res) =>
  publish{{primaryResourceSingularUcFirst}}Created(res.locals.mappedBody, res.locals.tenantId)
    .then(() =>
      res.sendStatus(201))
    .catch(handleError(res)));

router.put('/:id', validateInput(validateUpdate{{primaryResourceSingularUcFirst}}), ({ params, body }, res) =>
  publish{{primaryResourceSingularUcFirst}}Updated({ id: params.id, ...body }, res.locals.tenantId)
    .then(() =>
      res.sendStatus(204))
    .catch(handleError(res)));

router.delete('/:id', getTenantId, ({ params }, res) =>
  publish{{primaryResourceSingularUcFirst}}Deleted(params.id, res.locals.tenantId)
    .then(() =>
      res.sendStatus(204))
    .catch(handleError(res)));

module.exports = router;
