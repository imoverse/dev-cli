const log = require('@imoverse/logger');
const { publishEvent } = require('@imoverse/events');
const { {{primaryResourcePlural}} } = require('./db');

const {{primaryResourceSingularUc}}_CREATED = '{{primaryResourceSingular}}-created';
const {{primaryResourceSingularUc}}_UPDATED = '{{primaryResourceSingular}}-updated';
const {{primaryResourceSingularUc}}_DELETED = '{{primaryResourceSingular}}-deleted';

exports.publish{{primaryResourceSingularUcFirst}}Created = {{primaryResourceSingular}} =>
  publishEvent({{primaryResourceSingularUc}}_CREATED, {{primaryResourceSingular}});

exports.publish{{primaryResourceSingularUcFirst}}Updated = {{primaryResourceSingular}} =>
  publishEvent({{primaryResourceSingularUc}}_UPDATED, {{primaryResourceSingular}});

exports.publish{{primaryResourceSingularUcFirst}}Deleted = (id, tenantId) =>
  publishEvent({{primaryResourceSingularUc}}_DELETED, { id, tenantId });

const handle{{primaryResourceSingularUcFirst}}Created = ({ eventId, data: {{primaryResourceSingular}} }) =>
  {{primaryResourcePlural}}.add({{primaryResourceSingular}})
    .then(() =>
      log.info(`Event ${eventId} handled. Added {{primaryResourceSingular}} ${ {{primaryResourceSingular}}.id }`))
    .catch(err =>
      log.error(`Error handling event ${eventId}: ${err}`));

const handle{{primaryResourceSingularUcFirst}}Updated = ({ eventId, data: {{primaryResourceSingular}} }) =>
  {{primaryResourcePlural}}.update({{primaryResourceSingular}})
    .then(() =>
      log.info(`Event ${eventId} handled. Updated {{primaryResourceSingular}} ${ {{primaryResourceSingular}}.id}`))
    .catch(err =>
      log.error(`Error handling event ${eventId}: ${err}`));

const handle{{primaryResourceSingularUcFirst}}Deleted = ({ eventId, data: { id, tenantId } }) =>
  {{primaryResourcePlural}}.remove(id, tenantId)
    .then(() =>
      log.info(`Event ${eventId} handled. Removed {{primaryResourceSingular}} ${id}`))
    .catch(err =>
      log.error(`Error handling event ${eventId}: ${err}`));

exports.events = {
  {{primaryResourceSingularUc}}_CREATED,
  {{primaryResourceSingularUc}}_UPDATED,
  {{primaryResourceSingularUc}}_DELETED,
};

exports.handlers = {
  handle{{primaryResourceSingularUcFirst}}Created,
  handle{{primaryResourceSingularUcFirst}}Updated,
  handle{{primaryResourceSingularUcFirst}}Deleted,
};
