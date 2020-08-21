const {
  head, map, groupBy, prop, curry, pipe, propOr,
} = require('ramda');
const { maybeISO8601String } = require('@imoverse/skapet');
const { runSql } = require('../lib');
const productImages = require('./productImages');

const mapProduct = (product, imageIds) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  imageIds,
  created: product.created,
  updated: product.updated,
  tenantId: product.tenantid,
});

const filterByProductId = (productId, groupedImages) =>
  pipe(
    propOr(productId, []),
    map(prop('imageId')),
  )(groupedImages);

const mapProducts = (products, groupedImages) =>
  map(product => {
    const images = filterByProductId(product.id, groupedImages);

    return mapProduct(product, images);
  }, products);

const getProducts = tenantId =>
  runSql('SELECT * FROM products WHERE tenantid = $1', [tenantId]);

exports.all = tenantId =>
  Promise.all([
    getProducts(tenantId),
    productImages.all(tenantId),
  ])
    .then(([products, images]) => {
      const groupedImages = groupBy(prop('productid'), images);

      return mapProducts(products, groupedImages);
    });

// TODO: Make a "one item" version of runSql.
// Maybe a sql module like sql.all(query), sql.find(query) etc
exports.find = (id, tenantId) =>
  runSql('SELECT * FROM products WHERE id = $1 AND tenantid = $2', [id, tenantId])
    .then(head)
    .then(product =>
      productImages.find(product.id, tenantId)
        .then(images => mapProduct(product, images)));

const insertProduct = ({
  id, name, description = '', price, tenantId, created, updated,
}) => {
  const sql = 'INSERT INTO products (id, name, description, price, tenantid, created, updated) VALUES ($1, $2, $3, $4, $5, $6, $7)';
  const params = [
    id,
    name,
    description,
    price,
    tenantId,
    maybeISO8601String(created).orJust(null),
    maybeISO8601String(updated).orJust(null),
  ];

  return runSql(sql, params);
};

exports.add = ({ imageIds, ...product }) =>
  insertProduct(product)
    .then(() =>
      insertImages(product.id, imageIds));

exports.update = ({
  id, name, description = '', price, tenantId, updated,
}) => {
  const sql = 'UPDATE products SET name = $1, description = $2, price = $3, updated = $4 WHERE id = $5 AND tenantid = $6';
  const params = [
    name,
    description,
    price,
    maybeISO8601String(updated).orJust(null),
    id,
    tenantId,
  ];

  return runSql(sql, params);
};

exports.remove = (id, tenantId) =>
  runSql('DELETE FROM products WHERE id = $1 AND tenantid = $2', [id, tenantId]);
