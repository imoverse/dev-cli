const express = require('express');
const cors = require('cors');
const events = require('@imoverse/events');
const log = require('@imoverse/logger');
const { InvalidInputError, corsWhitelist } = require('@imoverse/skapet');
const { {{resource}}Router, {{resource}}Events: eventTypes, {{resource}}Handlers: handlers } = require('./{{resource}}');

const app = express();

const whitelist = [process.env.COMMANDCENTER];

app.use(cors(corsWhitelist(whitelist)));
app.use(require('body-parser').json());

app.get('/healthz', (req, res) => res.sendStatus(200));

app.use('/{{projectName}}/{{resource}}', {{resource}}Router);

events
  .addLogger(log)
  .subscribe(eventTypes.EVENT_NAME, handlers.handleEVENT)
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
