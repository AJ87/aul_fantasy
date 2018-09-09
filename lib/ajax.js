var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var database = require('./database.js');

const teams_table = 'teams';
const fantasy_teams_table = 'fantasyteams';
const checkCacheTable = 'checkCache';
const stats = 'statsround';
const status_ok = 200;
const status_no_data = 404;
const status_err = 500;

var _log = null;

// dates each round starts
// these need to be added into a config table in the future
var round1 = new Date('2018-09-12T09:00:00');
var round2 = new Date('2018-09-17T09:00:00');
var round3 = new Date('2018-09-24T09:00:00');
var round4 = new Date('2018-10-01T09:00:00');
var round5 = new Date('2018-10-08T09:00:00');

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
  let positive = 25 * parseInt(player.goals) + 15 * parseInt(player.assists) + 50 * parseInt(player.blocks);
  let touches = 5 * parseInt(player.touches);
  let negative = 50 * parseInt(player.drops) + 30 * parseInt(player.throwaways);

  _log.debug(`pos: ${positive} tchs: ${touches} neg: ${negative}`);

  return (positive + touches - negative);
}

function addRoundsTogether(collections) {
  const result = collections.reduce((result,item) => {

    _log.debug(item);

    for (let team of item) {
      const existing_team = result.find(x => x.name === team.name);
      if (existing_team) {

        for (let player of team.players) {
          const existing = existing_team.players.find(x => x.name === player.name);
          if (existing) {
            existing.assists = parseInt(existing.assists) + parseInt(player.assists);
            existing.goals = parseInt(existing.goals) + parseInt(player.goals);
            existing.touches = parseInt(existing.touches) + parseInt(player.touches);
            existing.drops = parseInt(existing.drops) + parseInt(player.drops);
            existing.throwaways = parseInt(existing.throwaways) + parseInt(player.throwaways);
            existing.blocks = parseInt(existing.blocks) + parseInt(player.blocks);
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

  let result = [];
  for (let team of teamStats) {
    for (let player of team.players) {
      for (let category in player) {
        // check it is a stat category
        if (!categories.includes(category)) {
          continue;
        }

        let stat = {
          rank:'',
          name: player.name,
          team: team.name,
          quantity: player[category]
        };

        const existing = result.find(x => x.category === category);
        if (existing) {
          if (player.sex === 'Male') {
            existing.men.push(stat);
          } else {
            existing.women.push(stat);
          }
        } else {
          var record = {category: category,
                      men:[],
                      women:[]};
          if (player.sex === "Male") {
            record.men.push(stat);
          } else {
            record.women.push(stat);
          }
          result.push(record);
        }
      }
    }
  }

// sort the results to create the rankings
  for (let record of result) {
    record.men.sort((a,b) => b.quantity - a.quantity);
    record.women.sort((a,b) => b.quantity - a.quantity);
    // add rank
    let rank = 0;
    for (let stat of record.men) {
      rank++;
      stat.rank = rank;
    }
    rank = 0;
    for (let stat of record.women) {
      rank++;
      stat.rank = rank;
    }
    // add extra blank record to prevent not being able to see last record
    record.men.push({rank:'',team:'',name:'',quantity:''});
    record.women.push({rank:'',team:'',name:'',quantity:''});
  }

  return result;
}

function convertToFantasyTeamStats(teamStats) {
  // get fantasy teams
  let key = {};
  return new Promise( function pr(resolve,reject) {
    database.getCollection(key, fantasy_teams_table)
    .then(
      function fullfilled(result) {
        for (let fantasyTeam of result) {
          fantasyTeam.totalScore = 0;
          if (!fantasyTeam.players) {
            continue;
          }
          for (let fantasyPlayer of fantasyTeam.players) {
            // find player
            for (let team of teamStats) {
              const player = team.players.find(x => x.name === fantasyPlayer.name);
              if (player) {
                fantasyPlayer.assists = parseInt(player.assists);
                fantasyPlayer.goals = parseInt(player.goals);
                fantasyPlayer.touches = parseInt(player.touches);
                fantasyPlayer.drops = parseInt(player.drops);
                fantasyPlayer.throwaways = parseInt(player.throwaways);
                fantasyPlayer.blocks = parseInt(player.blocks);
                fantasyPlayer.totalScore = parseInt(player.totalScore);
                fantasyTeam.totalScore = fantasyTeam.totalScore + parseInt(player.totalScore);
                break;
              }
            }
          }
        }
        result.sort((a,b) => b.totalScore > a.totalScore);
        let rank = 0;
        for (fantasyTeam of result) {
          rank++;
          fantasyTeam.rank = rank;
        }
        resolve(result);
      },
      function rejected(reason) {
        resolve([]);
      }
    );
  });
}

function createFantasyLadder(fantasyCollection) {
  var copy = fantasyCollection.map(a => Object.assign({},a));
  copy.map(a => delete a.players);
  return copy;
}

function checkCacheValid(tableName) {
  // check whether the table cache is still valid
  let key = {table:tableName};
  // need to return as promise
  return new Promise( function pr(resolve,reject) {
    database.getRecord(key,checkCacheTable)
    .then(
      function fullfilled(result) {
        // valid needs to be true and round needs to be the same
        if (result.valid && result.round === getRound()) {
          // for testing
          //reject();
          resolve();
        } else {
          reject();
        }
      },
      function rejected(reason) {
        reject();
      }
    );
  });
}

function invalidateCache() {
  // invalidate the 3 caches
  let caches = ['statsByCategoryCache','statsByTeamCache',fantasy_teams_table];

  caches.map(table => database.updateRecord({table:table},{table:table,valid:false},checkCacheTable));
}

function cacheValid(table) {
  database.updateRecord({table:table},{table:table,valid:true,round:getRound()},checkCacheTable);
}

function updateCache(table,collection) {
  for (record of collection) {
    let key;
    switch (table) {
      case 'statsByCategoryCache':
        key = {category:record.category};
        break;
      default:
        key = {name:record.name};
        break;
    };
    database.updateRecord(key,record,table)
    .then(
      function fullfilled(results) {
        // do nothing
      },
      function rejected(reason) {
        _log.info(reason);
      }
    );
  };
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
          // add workaround to buffer table to show all rows above footer
          for (let team of result) {
            team.players.push({name:'',sex:'',position:'',height:'',age:'',playerNumber:''});
            team.players.push({name:'',sex:'',position:'',height:'',age:'',playerNumber:''});
          }
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
    // invalidate caches
    invalidateCache();
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
    // invalidate cache
    invalidateCache();
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
    _log.debug("stats by category");

    let table = 'statsByCategoryCache';
    // check if cache is still valid
    checkCacheValid(table)
    .then(
      function fullfilled(result) {
        // get from cache table
        let key = {};
        database.getCollection(key,table)
        .then(
          function fullfilled(result) {
            res.status(status_ok).send(result);
          },
          function rejected(reason) {
            res.status(status_err).send(reason);
          }
        );
      },
      function rejected(reason) {
        // recalculate results
        getStatsUpToRound(getRound())
        .then(function(results) {
          if (results.length === 0) {
            // no data
            res.status(status_ok).send();
          } else {
            let combined = addRoundsTogether(results);
            let data = convertToPlayerStats(combined);
            // save to table and update Cache table
            cacheValid(table);
            updateCache(table,data);
            res.status(status_ok).send(data);
          }
        });
      }
    );
  });

// provide stats by team
router.route('/stats/teams')
  .get(function(req, res) {
    _log.debug("stats by team");

    let table = 'statsByTeamCache';
    // check if cache is still valid
    checkCacheValid(table)
    .then(
      function fullfilled(result) {
        // get from cache table
        let key = {};
        database.getCollection(key,table)
        .then(
          function fullfilled(result) {
            // add workaround to buffer table to show all rows above footer
            for (let team of result) {
              team.players.push({name:'',sex:'',position:''});
            }
            res.status(status_ok).send(result);
          },
          function rejected(reason) {
            res.status(status_err).send(reason);
          }
        );
      },
      function rejected(reason) {
        // recalculate results
        getStatsUpToRound(getRound())
        .then(function(results) {
          if (results.length === 0) {
            // no data
            res.status(status_ok).send();
          } else {
            let data = addRoundsTogether(results);
            // save to table and update cache table
            cacheValid(table);
            updateCache(table,data);
            res.status(status_ok).send(data);
          }
        });
      }
    );
  });

// provide the fantasy ladder
router.route('/fantasy-ladder')
  .get(function(req, res) {
    _log.debug("fantasy teams ladder");

    // check if cache is still valid
    checkCacheValid(fantasy_teams_table)
    .then(
      function fullfilled(result) {
        // get from cache table
        let key = {};
        database.getCollection(key,fantasy_teams_table)
        .then(
          function fullfilled(result) {
            // need to resort by rank as db doesn't guarantee sort order
            let ladder = createFantasyLadder(result);
            ladder.sort((a,b) => a.rank - b.rank);
            res.status(status_ok).send(ladder);
          },
          function rejected(reason) {
            res.status(status_err).send(reason);
          }
        );
      },
      function rejected(reason) {
        // recalculate results
        getStatsUpToRound(getRound())
        .then(function(results) {
          let combined = addRoundsTogether(results);
          convertToFantasyTeamStats(combined)
          .then(
            function fullfilled(result) {
              // save to table and update Cache table
              cacheValid(fantasy_teams_table);
              updateCache(fantasy_teams_table,result);
              _log.info(result);
              res.status(status_ok).send(createFantasyLadder(result));
            },
            function rejected(reason) {
              res.status(status_err).send(reason);
            }
          );
        });
      }
    );
  });

router.route('/fantasy-team/:name')
// provide the fantasy team's player list
  .get(function(req, res) {
    _log.debug("fantasy teams");

    // check if cache is still valid
    checkCacheValid(fantasy_teams_table)
    .then(
      function fullfilled(result) {
        // get from cache table
        let key = {teamName:req.params.name};
        database.getRecord(key,fantasy_teams_table)
        .then(
          function fullfilled(result) {
            res.status(status_ok).send(result.players);
          },
          function rejected(reason) {
            res.status(status_err).send(reason);
          }
        );
      },
      function rejected(reason) {
        // recalculate results
        getStatsUpToRound(getRound())
        .then(function(results) {
          if (results.length === 0) {
            // no data
            res.status(status_ok).send();
          } else {
            let combined = addRoundsTogether(results);
            convertToFantasyTeamStats(combined)
            .then(
              function fullfilled(result) {
                // save to table and update Cache table
                cacheValid(fantasy_teams_table);
                updateCache(fantasy_teams_table,result);
                let record = result.find(x => x.teamName === req.params.name);
                res.status(status_ok).send(record.players);
              },
              function rejected(reason) {
                res.status(status_err).send(reason);
              }
            );
          }
        });
      }
    );
  })
  // register a fantasy team
  .post(function(req, res) {
    // both team name and email must be unique
    // team name will be checked in db call
    // check email

    // convert email to lowercase to check
    let email_lower = req.body.email.toLowerCase();
    let key = {email:email_lower};
    let table = 'email_table';

    _log.info(req.body);

    // don't allow registration after rounds have started
    // hard code as rounds have now started - should add in config table in future
    // if (getRound() > 0) {
      res.status(status_err).send('Competition has started. Can no longer register teams');
    // }

    database.getRecord(key,table)
    .then(
      function fullfilled(result) {
        // if we find email then save
        database.createRecord({teamName:req.params.name}, req.body, fantasy_teams_table)
        .then(
          function fullfilled(result) {
            // invalidate fantasy team cache
            database.updateRecord({table:fantasy_teams_table},{table:fantasy_teams_table,valid:false},checkCacheTable);
            res.status(status_ok).send();
          },
          function rejected(reason) {
            _log.info(reason);
            res.status(status_err).send(`Team name already exists. Choose another.`);
          }
        );
      },
      function rejected(reason) {
        // no record found don't allow registration
        res.status(status_err).send('That email is not registered to participate in the AUL fantasy league');
      }
    );

  });

// mixin general functions
var teamRouter = Object.assign({router: router}, abstract);

module.exports = teamRouter;
