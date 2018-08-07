'use strict';
var database = require('./lib/database.js');
var logger = require('./lib/logger.js');
var csv = require('csvtojson');

let appName = 'AddUserToDB';

// set up logger
logger.initialise(appName);
var log = logger.get();

// server
let filePath = '/aul/fantasy/aul_fantasy/AULUserList.csv';
// local path
//let filePath = '/Users/AJ87/Desktop/AULUserList.csv';

let table = 'email_table';

// initialise database
database.initialise(log)
.then(
  function fullfilled(result) {

    csv()
    .fromFile(filePath)
    .then((jsonObj)=>{
      // add emails to DB
        log.info(jsonObj);
        jsonObj.map(x => updateDB(x));
    });

  },
  function rejected(reason) {
    log.error(`Error initialising database: ${reason}`);
  }
);

function updateDB(obj) {
  database.createRecord(obj, obj, table)
  .then(
    function fullfilled(result) {
      // do nothing success
    },
    function rejected(reason) {
      // provide error - may be ok though
      log.info(`Couldn't update DB: ${reason}`);
    }
  );
}
