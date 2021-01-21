const { map } = require('ramda');
const { maybeISO8601String } = require('@imoverse/fp-utils');
const db = require('@imoverse/db');
const { v4: uuid } = require('uuid');

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
    .map(maybe => maybe.map({{primaryResourceSingular}}));

exports.add = async ({{primaryResourceSingular}}, tenantId) => {
  const sql = 'INSERT INTO {{primaryResourcePlural}} (id, tenantid, created, updated) VALUES ($1, $2, $3, $4) RETURNING *';
  const params = [
    uuid(),
    tenantId,
    maybeISO8601String({{primaryResourceSingular}}.created).orNull(),
    maybeISO8601String({{primaryResourceSingular}}.updated).orNull(),
  ];

  return (await db.upsertReturning(sql, params)).map(map{{primaryResourceSingular}});
};

exports.update = ({{primaryResourceSingular}}, id, tenantId) => {
  const sql = 'UPDATE {{primaryResourcePlural}} SET updated = $1 WHERE id = $2 AND tenantid = $3 RETURNING *';
  const params = [
    maybeISO8601String({{primaryResourceSingular}}.updated).orNull(),
    id,
    tenantId,
  ];

  return (await db.upsertReturning(sql, params)).map(map{{primaryResourceSingular}});
};

exports.remove = (id, tenantId) =>
  db.query('DELETE FROM {{primaryResourcePlural}} WHERE id = $1 AND tenantid = $2', [id, tenantId]);
