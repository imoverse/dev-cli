const { Pool } = require('pg');
const { prop } = require('ramda');
const log = require('@imoverse/logger');

const pool = new Pool({ ssl: process.env.PGUSESSL === 'true' });

const runSql = async (sql, params) =>
  new Promise((resolve, reject) =>
    pool.connect()
      .catch(err => {
        log.error(`Could not connect to postgres: ${err}`);
        reject(err);
      })
      .then(client =>
        client.query(sql, params)
          .catch(err => {
            client.release();
            return reject(err);
          })
          .then(result => {
            client.release();
            return result;
          }))
      .then(prop('rows'))
      .then(resolve));

module.exports = runSql;
