const { head, map } = require('ramda');
const { maybeISO8601String } = require('@imoverse/skapet');
const { runSql } = require('../lib');

const mapCategory = ({
  id, name, description, created, updated, ...rest
}) => ({
  id,
  name,
  description,
  created,
  updated,
  imageId: rest.imageid,
  tenantId: rest.tenantid,
});

exports.all = tenantId =>
  runSql('SELECT * FROM categories WHERE tenantid = $1', [tenantId])
    .then(map(mapCategory));

exports.find = (id, tenantId) =>
  runSql('SELECT * FROM categories WHERE id = $1 AND tenantid = $2', [id, tenantId])
    .then(head)
    .then(mapCategory);

// TODO: Should validate iso date before inserting to db,
// instead of sending in null as default and failing
exports.add = ({
  id, name, description = '', tenantId, created, updated, imageId,
}) => {
  const sql = 'INSERT INTO categories (id, name, description, tenantid, created, updated, imageid) VALUES ($1, $2, $3, $4, $5, $6, $7)';
  const params = [
    id,
    name,
    description,
    tenantId,
    maybeISO8601String(created).orJust(null),
    maybeISO8601String(updated).orJust(null),
    imageId,
  ];

  return runSql(sql, params);
};

exports.update = ({
  id, name, description = '', tenantId, updated, imageId,
}) => {
  const sql = 'UPDATE categories SET name = $1, description = $2, updated = $3, imageid = $4 WHERE id = $5 AND tenantid = $6';
  const params = [
    name,
    description,
    maybeISO8601String(updated).orJust(null),
    imageId,
    id,
    tenantId,
  ];

  return runSql(sql, params);
};

exports.remove = (id, tenantId) =>
  runSql('DELETE FROM categories WHERE id = $1 AND tenantid = $2', [id, tenantId]);
