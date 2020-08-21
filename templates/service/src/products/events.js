const log = require('@imoverse/logger');
const { publishEvent } = require('../lib');
const { products } = require('../db');

const PRODUCT_CREATED = 'product-created';
const PRODUCT_UPDATED = 'product-updated';
const PRODUCT_DELETED = 'product-deleted';

exports.publishProductCreated = product =>
  publishEvent(PRODUCT_CREATED, product);

exports.publishProductUpdated = product =>
  publishEvent(PRODUCT_UPDATED, product);

exports.publishProductDeleted = (id, tenantId) =>
  publishEvent(PRODUCT_DELETED, { id, tenantId });

const handleProductCreated = ({ eventId, data: product }) =>
  products.add(product)
    .then(() =>
      log.info(`Event ${eventId} handled. Added product ${product.id}`))
    .catch(err =>
      log.error(`Error handling event ${eventId}: ${err}`));

const handleProductUpdated = ({ eventId, data: product }) =>
  products.update(product)
    .then(() =>
      log.info(`Event ${eventId} handled. Updated product ${product.id}`))
    .catch(err =>
      log.error(`Error handling event ${eventId}: ${err}`));

const handleProductDeleted = ({ eventId, data: { id, tenantId } }) =>
  products.remove(id, tenantId)
    .then(() =>
      log.info(`Event ${eventId} handled. Removed product ${id}`))
    .catch(err =>
      log.error(`Error handling event ${eventId}: ${err}`));

exports.events = {
  PRODUCT_CREATED,
  PRODUCT_UPDATED,
  PRODUCT_DELETED,
};

exports.handlers = {
  handleProductCreated,
  handleProductUpdated,
  handleProductDeleted,
};
