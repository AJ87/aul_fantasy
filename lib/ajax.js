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

// dates each round starts
var round1 = new Date('2018-07-04T20:00:00');
var round2 = new Date('2018-08-16T20:00:00');
var round3 = new Date('2018-08-23T20:00:00');
var round4 = new Date('2018-08-30T20:00:00');
var round5 = new Date('2018-09-06T20:00:00');

function getRound() {
  var today = new Date();

  if (today > round5) {
    return 5;
  }
  if (today > round4) {
    return 4;
  }
  if (today > round3) {
    return 3;
  }
  if (today > round2) {
    return 2;
  }
  if (today > round1) {
    return 1;
  }
  return 0;
}

function getStatsUpToRound(round) {
  // if we are before the beginning exit
  if (round === 0) {
    return Promise.all([]);
  }

  var rounds = [];
  for (var i = 0; i < round; i++) {
    rounds.push(`${stats}${round}`);
  }

  key = {};

  const promises = rounds.map(table => database.getCollection(key,table));

  return Promise.all(promises);
}

function calculateTotalScore(player) {
  return (player.goals + player.assists + (2 * player.blocks) + (0.05 * player.touches) - (3 * (player.drops + player.throwaways)));
}

function addRoundsTogether(collections) {
  const result = collections.reduce((result,item) => {

    _log.info(item);

    for (let team of item) {
      const existing_team = result.find(x => x.name === team.name);
      if (existing_team) {

        for (let player of team.players) {
          const existing = existing_team.players.find(x => x.name === player.name);
          if (existing) {
            existing.assists += player.assists;
            existing.goals += player.goals;
            existing.touches += player.touches;
            existing.drops += player.drops;
            existing.throwaways += player.throwaways;
            existing.blocks += player.blocks;
            existing.totalScore = calculateTotalScore(existing);
          } else {
            player.totalScore = calculateTotalScore(player);
            existing_team.players.push(player);
          }
        }
      } else {
        // calculate total score
        for (let player of team.players) {
          player.totalScore = calculateTotalScore(player);
        }
        result.push(team);
      }
    }

    return result;
  }, []);

  return result;
}

function convertToPlayerStats(teamStats) {
  var categories = ['assists','goals','touches','drops','throwaways','blocks','totalScore'];

  var result = {stats:[]};
  for (let team of teamStats) {
    for (let player of team.players) {
      for (let category in player) {
        // check it is a stat category
        if (!categories.includes(category)) {
          continue;
        }

        const existing = result.stats.find(x => x.category === category);
        if (existing) {

        } else {
          var stat = {category: category,
                      players: [{men:[],
                                 women:[]}]
                     };
          if (player.sex === "Male") {
            stat.players.men.push({
              rank:'',
              name: player.name,
              team: team.name,
              quantity: player[category]
            });
          } else {
            stat.players.women.push({
              rank:'',
              name: player.name,
              team: team.name,
              quantity: player[category]
            });
          }
          result.stats.push(stat);
        }
      }
    }
  }

// sort the results to create the rankings

  return result;
}

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

// provide the player stats all broken up by category and ranking
router.route('/stats/categories')
  .get(function(req, res) {

  });

// provide stats by team
router.route('/stats/teams')
  .get(function(req, res) {
    _log.info("stats by team");

    getStatsUpToRound(getRound())
      .then(function(results) {
        if (results.length === 0) {
          // no data
          res.status(status_ok).send();
        } else {
          res.status(status_ok).send(addRoundsTogether(results));
        }
      });

  });

// provide the fantasy ladder
router.route('/fantasy-ladder')
  .get(function(req, res) {

  });

router.route('/fantasy-team/:name')
// provide the fantasy team's player list
  .get(function(req, res) {
    // combine all the rounds that we are up to

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
