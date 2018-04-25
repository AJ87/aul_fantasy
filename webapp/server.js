'use strict';
var http = require('http');
var fs = require('fs');
var path = require('path');
var database = require('./database.js');

var toLocalDate = function(utcDate) {
  var TZOffsetMs = 15*60*60*1000;
  var localDate = utcDate.getTime() + TZOffsetMs;
  return new Date(localDate);
}

database.initialise()
.then(
  function fullfilled(result) {

    http.createServer(function (request, response) {
      console.log('request starting...');
      console.log(`URL: ${request.url}`);

      var filePath = '.' + request.url;

      filePath = filePath.split('?');
      var params = filePath[1];
      filePath = filePath[0];

      console.log(`File path: ${filePath}`);
      console.log(`Params: ${params}`);

  }).listen(3125); //3125 loally and 80 on aws
    console.log('Server running at http://127.0.0.1:80/');

  },
  function rejected(reason) {
    console.log(`Error initialising database: ${reason}`);
  }
);
