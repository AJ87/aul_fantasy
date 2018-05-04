var express = require('express');
var router = express.Router();
var operations = require('./operations.js');
var abstractPageRoute = require('./abstractPageRoute.js');

const db_table = 'sermons';

router.use(function(req, res, next) {
  console.log(req.url);
  console.log('Time: ', Date());
  next();
});

router.route('/')
  .post(function(req, res) {
    // create new team
    operations.createRecord({id: req.body.id}, req.body, db_table, res);
  });

extend(router.prototype, abstractPageRoute);

module.exports = router;
