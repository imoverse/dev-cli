const log = require('@imoverse/logger');
const { eventHandler } = require('@imoverse/failed-events');

const {{primaryResourceSingularUc}}_CREATED = '{{primaryResourceSingular}}-created';
const {{primaryResourceSingularUc}}_UPDATED = '{{primaryResourceSingular}}-updated';
const {{primaryResourceSingularUc}}_DELETED = '{{primaryResourceSingular}}-deleted';

exports.publish{{primaryResourceSingularUcFirst}}Created = ({{primaryResourceSingular}}, tenantId) =>
  eventHandler({{primaryResourceSingularUc}}_CREATED, tenantId, {{primaryResourceSingular}});

exports.publish{{primaryResourceSingularUcFirst}}Updated = ({{primaryResourceSingular}}, tenantId) =>
  eventHandler({{primaryResourceSingularUc}}_UPDATED, tenantId, {{primaryResourceSingular}});

exports.publish{{primaryResourceSingularUcFirst}}Deleted = (id, tenantId) =>
  eventHandler({{primaryResourceSingularUc}}_DELETED, tenantId, { id });

const logEventResult = (eventId, tenantid, data) =>
  Promise.resolve(log.info(`Event ${eventId} handled for tenant ${tenantid} `, data));

const handle{{primaryResourceSingularUcFirst}}Created = ({ eventId, tenantId, data: {{primaryResourceSingular}} }) =>
  logEventResult(eventId, tenantId, {{primaryResourceSingular}});

const handle{{primaryResourceSingularUcFirst}}Updated = ({ eventId, tenantId, data: {{primaryResourceSingular}} }) =>
  logEventResult(eventId, tenantId, {{primaryResourceSingular}});

const handle{{primaryResourceSingularUcFirst}}Deleted = ({ eventId, tenantId, data: { id } }) =>
  logEventResult(eventId, tenantId, id);

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
