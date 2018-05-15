var express = require('express');
var router = express.Router();
var database = require('./database.js');

const db_table = 'fantasy-teams';
const status_ok = 201;
const status_dup_key = 409;

var _log = null;

var abstract = {
  setLogger: function(log) {
    _log = log;
  }
};

router.use(function(req, res, next) {
  _log.info(req.url);
  next();
});

router.route('/')
  .post(function(req, res) {
    // create new team
    database.createRecord({id: req.body.id}, req.body, db_table)
    .then(
      function fullfilled(result) {
        _log.debug(result);
        res.status(status_ok).send(result);
      },
      function rejected(reason) {
        _log.info(reason);
        res.status(status_dup_key).send(reason);
      }
    );
  });

// mixin general functions
var teamRouter = Object.assign({router:router}, abstract);

module.exports = teamRouter;
