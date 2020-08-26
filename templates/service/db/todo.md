# Database migration

Create files in this folder on the format
YYYYMMDDHHMMSS_<description>.js
Example: 20200826080000_create_customer.js

The files should have the [knex](http//knexjs.org) instructions, like this:

```
exports.up = knex => {
  const createQuery = knex.schema.createTable('customer', table => {
    table.uuid('customerid').primary();
    table.string('firstname');
    table.string('lastname');
    table.string('email').notNullable();
  });
  return createQuery;
};

exports.down = knex => {
  const dropQuery = knex.schema.dropTable('customer');
  return dropQuery;
};
```

The content of these files will be run exactly once in each environment, during the deployment process, prior to starting up the container.
