const fs = require('fs');
const shell = require('shelljs');

const fileContent = `/*
const tableName = TABLENAME;

// Example: Add column
exports.up = knex =>
  knex.schema.table(tableName, table => {
    table.json('categories');
  });

exports.down = knex =>
  knex.schema.table(tableName, table => {
    table.dropColumn('categories');
  });
// =======================
// Example: Create table
exports.up = knex =>
  knex.schema.createTable(tableName, table => {
    table.uuid('id').primary();
    table.uuid('tenantid').notNullable();
    table.timestamp('created').notNullable();
  });

exports.down = knex =>
  knex.schema.dropTable(tableName);
*/
`;

module.exports = (context, name) => {
  const {
    root,
    currentContainer,
  } = context;
  const now = new Date();
  const ts = now.toISOString().replace(/([^\d]|-)/g, '').substr(0, 12);
  const targetFile = `${root}/${currentContainer}/db/${ts}_${name}.js`;
  fs.writeFileSync(targetFile, fileContent);
  shell.echo(`Knex migration file created: ${targetFile}`);
};
