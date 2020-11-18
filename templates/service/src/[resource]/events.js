const log = require('@imoverse/logger');
const { publishEvent } = require('@imoverse/events');
const { curry } = require('ramda');
const {{primaryResourcePlural}} = require('./db');

const {{primaryResourceSingularUc}}_CREATED = '{{primaryResourceSingular}}-created';
const {{primaryResourceSingularUc}}_UPDATED = '{{primaryResourceSingular}}-updated';
const {{primaryResourceSingularUc}}_DELETED = '{{primaryResourceSingular}}-deleted';

exports.publish{{primaryResourceSingularUcFirst}}Created = ({{primaryResourceSingular}}, tenantId)=>
  publishEvent({{primaryResourceSingularUc}}_CREATED, tenantId, {{primaryResourceSingular}});

exports.publish{{primaryResourceSingularUcFirst}}Updated = ({{primaryResourceSingular}}, tenantId)=>
  publishEvent({{primaryResourceSingularUc}}_UPDATED, tenantId, {{primaryResourceSingular}});

exports.publish{{primaryResourceSingularUcFirst}}Deleted = (id, tenantId) =>
  publishEvent({{primaryResourceSingularUc}}_DELETED, tenantId, { id });

const logEventResult = curry(
  (eventId, result) =>
    result.cata({
      Failure: err =>
        log.error(`Error handling event ${eventId}: ${err}`),
      Ok: _ =>
        log.info(`Event ${eventId} handled`),
    }),
);

const handle{{primaryResourceSingularUcFirst}}Created = ({ eventId, tenantId, data: {{primaryResourceSingular}} }) =>
  {{primaryResourcePlural}}.add({{primaryResourceSingular}}, tenantId)
    .then(logEventResult(eventId))
    .catch(err =>
      log.error(`Error handler should never be called ${eventId}: ${err}`));

const handle{{primaryResourceSingularUcFirst}}Updated = ({ eventId, tenantId, data: {{primaryResourceSingular}} }) =>
  {{primaryResourcePlural}}.update({{primaryResourceSingular}}, tenantId)
    .then(logEventResult(eventId))
    .catch(err =>
      log.error(`Error handler should never be called ${eventId}: ${err}`));

const handle{{primaryResourceSingularUcFirst}}Deleted = ({ eventId, tenantId, data: { id } }) =>
  {{primaryResourcePlural}}.remove(id, tenantId)
    .then(logEventResult(eventId))
    .catch(err =>
      log.error(`Error handler should never be called ${eventId}: ${err}`));

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
