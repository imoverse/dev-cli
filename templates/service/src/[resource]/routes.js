const express = require('express');
const log = require('@imoverse/logger');
// TODO: Remove permissionCheck or use it
const { authorize, setTenantId, permissionCheck } = require('@imoverse/authorize');
const { findTenantId } = require('@imoverse/lib');
const { curry, head } = require('ramda');
const { validateInput } = require('@imoverse/validation');
const {{primaryResourcePlural}} = require('./db');
const { validateAdd{{primaryResourceSingularUcFirst}}, validateUpdate{{primaryResourceSingularUcFirst}} } = require('./validation');
const {
  publish{{primaryResourceSingularUcFirst}}Created,
  publish{{primaryResourceSingularUcFirst}}Updated,
  publish{{primaryResourceSingularUcFirst}}Deleted,
} = require('./events');

const router = express.Router();
router.use(authorize());
router.use(setTenantId);

const handleError = curry(
  (res, err) => {
    log.error(err);
    res.sendStatus(500);
  },
);

//TODO: Should getters not need authorization in your service?

router.get('/', findTenantId, async (req, res) =>
  (await {{primaryResourcePlural}}.all(res.locals.tenantId))
    .cata({
      Ok: result => res.send(result),
      Failure: err => handleError(res, err),
    }));

router.get('/:id', findTenantId, async({ params }, res) =>
  (await {{primaryResourcePlural}}.find(params.id, res.locals.tenantId)).cata({
    Failure: handleError(res),
    Ok: {{primaryResourceSingular}} => {{primaryResourceSingular}}.cata(
      () => res.sendStatus(404),
      x => res.send(x),
    )
  }));

//TODO: add appropriate permissions router.use(permissionCheck(['read:<resource>', 'write:<resource']));

router.post('/', validateInput(validateAdd{{primaryResourceSingularUcFirst}}), async ( { body }, res) =>
  (await {{primaryResourcePlural}}.add(body, res.locals.tenantId)).cata({
    Failure: handleError(res),
    Ok: async added => {
      // returns as list, but we only ever insert one obj so should be safe with head
      const a = head(added);
      await publish{{primaryResourceSingularUcFirst}}Created(a, res.locals.tenantId);
      res.status(201).send(a);
    },
  }));

router.put('/:id', validateInput(validateUpdate{{primaryResourceSingularUcFirst}}), async ({ params, body }, res) =>
  (await {{primaryResourcePlural}}.update(body, params.id, res.locals.tenantId))
    .cata({
      Failure: handleError(res),
      Ok: async updated => {
        await publish{{primaryResourceSingularUcFirst}}Updated(head(updated), res.locals.tenantId);
        res.sendStatus(204);
      },
    }));

router.delete('/:id', async ({ params }, res) =>
  (await {{primaryResourcePlural}}.remove(params.id, res.locals.tenantId))
    .cata({
      Failure: handleError(res),
      Ok: async () => {
        await publish{{primaryResourceSingularUcFirst}}Deleted(params.id, res.locals.tenantId);
        res.sendStatus(204);
      },
    }));

module.exports = router;
