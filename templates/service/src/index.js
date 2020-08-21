const express = require('express');
const cors = require('cors');
const mq = require('@imoverse/mq');
const log = require('@imoverse/logger');
const { InvalidInputError } = require('@imoverse/skapet');
const { corsOptions } = require('./lib');
const { catRouter, catEvents: cE, catHandlers: cH } = require('./categories');
const { productRouter, productEvents: pE, productHandlers: pH } = require('./products');

const app = express();

const whitelist = [process.env.COMMANDCENTER];

app.use(cors(corsOptions(whitelist)));
app.use(require('body-parser').json());

app.get('/healthz', (req, res) => res.sendStatus(200));

app.use('/{{projectName}}/TODO', {{projectName}}Router);

mq
  .addLogger(log)

  .subscribe(cE.CATEGORY_CREATED, cH.handleCategoryCreated)
  .subscribe(cE.CATEGORY_UPDATED, cH.handleCategoryUpdated)
  .subscribe(cE.CATEGORY_DELETED, cH.handleCategoryDeleted)

  .subscribe(pE.PRODUCT_CREATED, pH.handleProductCreated)
  .subscribe(pE.PRODUCT_UPDATED, pH.handleProductUpdated)
  .subscribe(pE.PRODUCT_DELETED, pH.handleProductDeleted)

  .connect();

app.use((err, req, res, next) => { // eslint-disable-line
  log.error(err);
  let status = 500;
  let message = 'Internal server error';
  if (err instanceof InvalidInputError) {
    status = 400;
    message = err.message;
  }
  res.status(status).send({ message, status });
});

const port = process.env.PORT || 3000;
app.listen(port, () => log.info(`{{projectName}} service running on port ${port}!`));
