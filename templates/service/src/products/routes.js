const express = require('express');
const log = require('@imoverse/logger');
const authorize = require('@imoverse/authorize');
const { curry } = require('ramda');
const { validateInput } = require('../lib');
const { products } = require('../db');
const { validateAddProduct, validateUpdateProduct } = require('./validation');
const {
  publishProductCreated,
  publishProductUpdated,
  publishProductDeleted,
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
  products.all(res.locals.tenantId)
    .then(cats => res.send(cats))
    .catch(handleError(res)));

router.get('/:id', getTenantId, ({ params }, res) =>
  products.find(params.id, res.locals.tenantId)
    .then(category => res.send(category))
    .catch(handleError(res)));

router.use(authorize());

router.post('/', mapBodyWithTenantId, validateInput(validateAddProduct), (_, res) =>
  publishProductCreated(res.locals.mappedBody)
    .then(() =>
      res.sendStatus(201))
    .catch(handleError(res)));

router.put('/:id', validateInput(validateUpdateProduct), ({ params, body }, res) =>
  publishProductUpdated({ id: params.id, ...body })
    .then(() =>
      res.sendStatus(204))
    .catch(handleError(res)));

router.delete('/:id', getTenantId, ({ params }, res) =>
  publishProductDeleted(params.id, res.locals.tenantId)
    .then(() =>
      res.sendStatus(204))
    .catch(handleError(res)));

module.exports = router;
