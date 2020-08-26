const log = require('@imoverse/logger');
const { publishEvent } = require('../lib');
const { categories } = require('../db');

const CATEGORY_CREATED = 'category-created';
const CATEGORY_UPDATED = 'category-updated';
const CATEGORY_DELETED = 'category-deleted';

exports.publishCategoryCreated = category =>
  publishEvent(CATEGORY_CREATED, category);

exports.publishCategoryUpdated = category =>
  publishEvent(CATEGORY_UPDATED, category);

exports.publishCategoryDeleted = (id, tenantId) =>
  publishEvent(CATEGORY_DELETED, { id, tenantId });

const handleCategoryCreated = ({ eventId, data: category }) =>
  categories.add(category)
    .then(() =>
      log.info(`Event ${eventId} handled. Added category ${category.id}`))
    .catch(err =>
      log.error(`Error handling event ${eventId}: ${err}`));

const handleCategoryUpdated = ({ eventId, data: category }) =>
  categories.update(category)
    .then(() =>
      log.info(`Event ${eventId} handled. Updated category ${category.id}`))
    .catch(err =>
      log.error(`Error handling event ${eventId}: ${err}`));

const handleCategoryDeleted = ({ eventId, data: { id, tenantId } }) =>
  categories.remove(id, tenantId)
    .then(() =>
      log.info(`Event ${eventId} handled. Removed category ${id}`))
    .catch(err =>
      log.error(`Error handling event ${eventId}: ${err}`));

exports.events = {
  CATEGORY_CREATED,
  CATEGORY_UPDATED,
  CATEGORY_DELETED,
};

exports.handlers = {
  handleCategoryCreated,
  handleCategoryUpdated,
  handleCategoryDeleted,
};
