const express = require('express');
const cors = require('cors');
const events = require('@imoverse/events');
const log = require('@imoverse/logger');
const { handleRouteErrors, corsWhitelist } = require('@imoverse/lib');
const { {{primaryResourcePlural}}Router, {{primaryResourcePlural}}Events: eventTypes, {{primaryResourcePlural}}Handlers: handlers } = require('./{{primaryResourcePlural}}');

const app = express();

const whitelist = [process.env.COMMANDCENTER];

app.use(cors(corsWhitelist(whitelist)));
app.use(require('body-parser').json());

app.get('/healthz', (req, res) => res.sendStatus(200));

app.use('/{{projectName}}/{{primaryResourcePlural}}', {{primaryResourcePlural}}Router);

events
  .addLogger(log)
  .subscribe(eventTypes.{{primaryResourceSingularUc}}_CREATED, handlers.handle{{primaryResourceSingularUcFirst}}Created)
  .subscribe(eventTypes.{{primaryResourceSingularUc}}_UPDATED, handlers.handle{{primaryResourceSingularUcFirst}}Updated)
  .subscribe(eventTypes.{{primaryResourceSingularUc}}_DELETED, handlers.handle{{primaryResourceSingularUcFirst}}Deleted)
  .connect();

app.use(handleRouteErrors);

const port = process.env.PORT || 3000;
app.listen(port, () => log.info(`{{projectName}} service running on port ${port}!`));
