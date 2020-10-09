const { map } = require('ramda');
const { maybeISO8601String } = require('@imoverse/fp-utils');
const db = require('@imoverse/db');

const map{{primaryResourceSingular}} = {{primaryResourceSingular}} => ({
  id: {{primaryResourceSingular}}.id,
  created: {{primaryResourceSingular}}.created,
  updated: {{primaryResourceSingular}}.updated,
  tenantId: {{primaryResourceSingular}}.tenantid,
});

const map{{primaryResourcePluralUcFirst}} =
  map(map{{primaryResourceSingular}});

exports.all = async tenantId =>
  (await db.list('SELECT * FROM {{primaryResourcePlural}} WHERE tenantid = $1', [tenantId]))
    .map(map{{primaryResourcePluralUcFirst}});

exports.find = async (id, tenantId) =>
  (await db.find('SELECT * FROM {{primaryResourcePlural}} WHERE id = $1 AND tenantid = $2', [id, tenantId]))
    .map(map{{primaryResourcePluralUcFirst}});

exports.add = async ({
  id, tenantId, created, updated,
}) => {
  const sql = 'INSERT INTO {{primaryResourcePlural}} (id, tenantid, created, updated) VALUES ($1, $2, $3, $4)';
  const params = [
    id,
    tenantId,
    maybeISO8601String(created).orJust(null),
    maybeISO8601String(updated).orJust(null),
  ];

  return db.query(sql, params);
};

exports.update = ({
  id, tenantId, updated,
}) => {
  const sql = 'UPDATE {{primaryResourcePlural}} SET updated = $1 WHERE id = $2 AND tenantid = $3';
  const params = [
    maybeISO8601String(updated).orJust(null),
    id,
    tenantId,
  ];

  return db.query(sql, params);
};

exports.remove = (id, tenantId) =>
  db.query('DELETE FROM {{primaryResourcePlural}} WHERE id = $1 AND tenantid = $2', [id, tenantId]);
