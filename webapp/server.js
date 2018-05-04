'use strict';
var database = require('./database.js');
var express = require('express');
var app = express();
var logger = require('./logger.js');

// constants
const port = 3000;
const appName = 'AULFantasySite';

// set up logger
logger.initialise(appName);
var log = logger.get();

// pages
var team = require('./team.js');
var ladder = require('./ladder.js');
var stats = require('./stats.js');

// use the following files to process these urls
app.use('/team', team);
app.use('/ladder', ladder);
app.use('/stats', stats);

// server static pages from the following folders
app.use(express.static('controller'));
app.use(express.static('view'));
app.use(express.static('css'));
app.use(express.static('i18n'));
app.use(express.static('model'));
app.use(express.static('resources'));
app.use(express.static('node_modules'));

// initialise database before starting the server
database.initialise(log)
.then(
  function fullfilled(result) {

// set the db
    team.setDB(database);
    ladder.setDB(database);
    stats.setDB(database);

// set logger
    team.setLogger(log);
    ladder.setLogger(log);
    stats.setLogger(log);

// start the server
    app.listen(port, function() {
      log.info(`App listening on ${port}`);
    });

  },
  function rejected(reason) {
    log.error(`Error initialising database: ${reason}`);
  }
);
