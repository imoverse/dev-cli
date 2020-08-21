const { map, curry } = require('ramda');
const { runSql } = require('../lib');

const mapProductImage = ({ productid, imageid, tenantid }) => ({
  productId: productid,
  imageId: imageid,
  tenantId: tenantid,
});

const mapProductImages =
  map(mapProductImage);

// TODO: Just fetch all, or fetch one time per product?
// Also clean up file afterwards
exports.all = tenantId =>
  runSql('SELECT * FROM productimages WHERE tenantid = $1', [tenantId])
    .then(mapProductImages);

exports.find = (productId, tenantId) =>
  runSql(
    'SELECT * from productimages WHERE productid = $1 AND tenantid = $2',
    [productId, tenantId],
  )
    .then(mapProductImages);

const add = curry(
  (productId, imageId) =>
    runSql(
      'INSERT INTO productimages (productid, imageid) VALUES ($1, $2)',
      [productId, imageId],
    ),
);

exports.add = add;

const formatValues = (productId, imageIds) =>
  map(imageId => `(${productId}, ${imageId})`, imageIds);

// TODO: Rename images to imageIds
// TODO: Look at inserting multiple items at once, see if query limit
exports.addList = (productId, imageIds = []) =>
  runSql(`INSERT INTO productimages (productid, imageid) VALUES ${formatValues(productId, imageIds)}`);
