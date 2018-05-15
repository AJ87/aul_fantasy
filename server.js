'use strict';
var database = require('./lib/database.js');
var express = require('express');
var app = express();
var logger = require('./lib/logger.js');

// constants
const port = 3000;
const appName = 'AULFantasySite';

// set up logger
logger.initialise(appName);
var log = logger.get();

// pages
var team = require('./lib/team.js');
var ladder = require('./lib/ladder.js');
var stats = require('./lib/stats.js');
var ajax = require('./lib/ajax.js');

// use the following files to process these urls
app.use('/fantasy-team', team.router);
//app.use('/ladder', ladder);
//app.use('/stats', stats);
app.use('/ajax', ajax.router);

// provide base logging
app.use(function(req, res, next) {
  log.debug(req.url);
  next();
});

// server static pages from the following folders
app.use(express.static('webapp'));

// initialise database before starting the server
database.initialise(log)
.then(
  function fullfilled(result) {

// set logger
    team.setLogger(log);
//    ladder.setLogger(log);
//    stats.setLogger(log);
    ajax.setLogger(log);

// start the server
    app.listen(port, function() {
      log.info(`App listening on ${port}`);
    });

  },
  function rejected(reason) {
    log.error(`Error initialising database: ${reason}`);
  }
);
