var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var database = require('./database.js');

const db_table = 'teams';
const status_ok = 200;
const status_no_data = 404;
const status_err = 500;

var _log = null;

var abstract = {
  setLogger: function(log) {
    _log = log;
  }
};

router.use(bodyParser.json());

router.use(function(req, res, next) {
  _log.info(req.url);
  next();
});

// get all the teams with their players for the registration page
router.route('/teams')
  .get(function(req, res) {
    var key = {};
    database.getCollection(key, db_table)
    .then(
      function fullfilled(result) {
        _log.debug(result);
        if (result) {
          res.status(status_ok).send(result);
        } else {
          res.status(status_no_data).send("Not Found");
        }
      },
      function rejected(reason) {
        _log.info(reason);
        res.status(status_err).send(reason);
      }
    );
  });

// update the provided team
router.route('/team/:name')
  .put(function(req, res) {
    var record = {
      name: req.params.name,
      players: req.body.players
    };
    _log.debug(record);
    database.updateRecord({name:req.params.name}, record, db_table)
    .then(
      function fullfilled(result) {
        res.status(status_ok).send();
      },
      function rejected(reason) {
        _log.info(reason);
        res.status(status_err).send(reason);
      }
    );
  });

// provide all the teams including the players for the player stats page
router.route('/stats')
  .get(function(req, res) {

  });

// provide the fantasy ladder
router.route('/fantasy-ladder')
  .get(function(req, res) {

  });

router.route('/fantasy-team/:id')
// provide the fantasy team's player list
  .get(function(req, res) {

  })
  // register a fantasy team
  .post(function(req, res) {
    _log.info("Team registered");
  });

// mixin general functions
var teamRouter = Object.assign({router: router}, abstract);

module.exports = teamRouter;
