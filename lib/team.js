var express = require('express');
var router = express.Router();
var operations = require('./operations.js');
var abstractPageRoute = require('./abstractPageRoute.js');

const db_table = 'sermons';

router.use(function(req, res, next) {
  this._log.info(req.url);
  next();
});

router.route('/')
  .post(function(req, res) {
    // create new team
    operations.createRecord({id: req.body.id}, req.body, db_table, res);
  });

  // mixin general functions
  var teamRouter = Object.assign({router:router}, abstractPageRoute);

module.exports = teamRouter;
