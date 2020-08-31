const express = require('express');
const log = require('@imoverse/logger');
const authorize = require('@imoverse/authorize');
const { curry } = require('ramda');
const { validateInput } = require('../lib');
const { categories } = require('../db');
const { validateAddCategory, validateUpdateCategory } = require('./validation');
const {
  publishCategoryCreated,
  publishCategoryUpdated,
  publishCategoryDeleted,
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
  categories.all(res.locals.tenantId)
    .then(cats => res.send(cats))
    .catch(handleError(res)));

router.get('/:id', getTenantId, ({ params }, res) =>
  categories.find(params.id, res.locals.tenantId)
    .then(category => res.send(category))
    .catch(handleError(res)));

router.use(authorize());

router.post('/', mapBodyWithTenantId, validateInput(validateAddCategory), (_, res) =>
  publishCategoryCreated(res.locals.mappedBody)
    .then(() =>
      res.sendStatus(201))
    .catch(handleError(res)));

router.put('/:id', validateInput(validateUpdateCategory), ({ params, body }, res) =>
  publishCategoryUpdated({ id: params.id, ...body })
    .then(() =>
      res.sendStatus(204))
    .catch(handleError(res)));

router.delete('/:id', getTenantId, ({ params }, res) =>
  publishCategoryDeleted(params.id, res.locals.tenantId)
    .then(() =>
      res.sendStatus(204))
    .catch(handleError(res)));

module.exports = router;
