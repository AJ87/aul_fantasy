var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var database = require('./database.js');

const teams_table = 'teams';
const fantasy_teams_table = 'fantasyteams';
const stats = 'statsround';
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
    database.getCollection(key, teams_table)
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
    database.updateRecord({name:req.params.name}, record, teams_table)
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
router.route('/stats/round/:round')
  .get(function(req, res) {
    var key = {};
    var stats_table = `${stats}${req.params.round}`;
    database.getCollection(key, stats_table)
    .then(
      function fullfilled(result) {
        _log.debug(result);
        stats_result = result;

        // get the teams table as well and use if the round table is empty
        database.getCollection(key, teams_table)
        .then(
          function fullfilled(result) {
            _log.debug(result);
            if (result || stats_result) {

              var combined_result = result.map(function(team) {
                function check_team(object) {
                  return object.name === team.name;
                }

                var found = stats_result.find(check_team);

                if (found) {
                  return found;
                } else {
                  return team;
                } 
              });

              res.status(status_ok).send(combined_result);
            } else {
              res.status(status_no_data).send("Not Found");
            }
          },
          function rejected(reason) {
            _log.info(reason);
            res.status(status_err).send(reason);
          }
        );
      },
      function rejected(reason) {
        _log.info(reason);
        res.status(status_err).send(reason);
      }
    );
  });

// update stats for one team for one round
router.route('/stats/round/:round/team/:name')
  .put(function(req, res) {
    var stats_table = `${stats}${req.params.round}`;
    var record = {
      name: req.params.name,
      players: req.body.players
    };
    database.updateRecord({name:req.params.name}, record, stats_table)
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

// provide the fantasy ladder
router.route('/fantasy-ladder')
  .get(function(req, res) {

  });

router.route('/fantasy-team/:name')
// provide the fantasy team's player list
  .get(function(req, res) {

  })
  // register a fantasy team
  .post(function(req, res) {
    // both team name and email must be unique
    // team name will be checked in db call
    // check email

    // convert email to lowercase to check


    _log.debug(req.body);
    database.createRecord({teamName:req.params.name}, req.body, fantasy_teams_table)
    .then(
      function fullfilled(result) {
        res.status(status_ok).send();
      },
      function rejected(reason) {
        _log.info(reason);
        res.status(status_err).send(`Team name already exists. Choose another.`);
      }
    );
  });

// mixin general functions
var teamRouter = Object.assign({router: router}, abstract);

module.exports = teamRouter;
